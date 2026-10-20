import { Roteiro } from '../dominio/Roteiro.js';
import { TempoInsuficienteError, ObrasInsuficientesError } from '../dominio/erros.js';
import { loggerPadrao } from '../infra/Logger.js';

export const MIN_OBRAS = 5; // US01: roteiros com 5 a 7 obras
export const MAX_OBRAS = 7;

export class RoteiroService {
  /**
   * @param {{ listarObrasDisponiveis: () => Promise<Array> }} obraRepository
   * @param {{ info: Function, warn: Function, medirTempo: Function }} [logger]
   */
  constructor(obraRepository, logger = loggerPadrao) {
    this.obras = obraRepository;
    this.logger = logger;
  }

  async gerarRoteiro(minutos) {
    return this.logger.medirTempo(
      'ROTEIRO_GERADO',
      async () => {
        const disponiveis = await this.obras.listarObrasDisponiveis();
        if (disponiveis.length < MIN_OBRAS) {
          throw new ObrasInsuficientesError(disponiveis.length, MIN_OBRAS);
        }

        // Ordem determinística: obras mais curtas primeiro (maximiza o número de paragens).
        const candidatas = [...disponiveis].sort(
          (a, b) => a.minutosVisita - b.minutosVisita || a.id.localeCompare(b.id),
        );

        const escolhidas = [];
        let total = 0;
        for (const obra of candidatas) {
          if (escolhidas.length === MAX_OBRAS) break;
          if (total + obra.minutosVisita <= minutos) {
            escolhidas.push(obra);
            total += obra.minutosVisita;
          }
        }

        if (escolhidas.length < MIN_OBRAS) {
          const minimo = candidatas.slice(0, MIN_OBRAS).reduce((s, o) => s + o.minutosVisita, 0);
          throw new TempoInsuficienteError(minutos, minimo);
        }

        // Percurso coerente: por piso e depois por sala, para evitar voltas desnecessárias.
        escolhidas.sort(
          (a, b) => a.piso - b.piso || a.salaId.localeCompare(b.salaId) || a.id.localeCompare(b.id),
        );

        const roteiro = new Roteiro(minutos);
        escolhidas.forEach((obra) => roteiro.adicionarParagem(obra));
        return roteiro;
      },
      { minutosPedidos: minutos },
    );
  }
}