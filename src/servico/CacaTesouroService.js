import { ProgressoCaca } from '../dominio/ProgressoCaca.js';
import { QRInvalidoError } from '../dominio/erros.js';
import { loggerPadrao } from '../infra/Logger.js';

export class CacaTesouroService {
  /**
   * @param {{ obraRepository, progressoRepository, logger? }} deps interfaces injetadas (ADR-0002)
   */
  constructor({ obraRepository, progressoRepository, logger = loggerPadrao }) {
    this.obras = obraRepository;
    this.progressos = progressoRepository;
    this.logger = logger;
  }

  async lerQR(idAnonimo, codigo) {
    const inicio = performance.now();
    const pista = await this.obras.obterPistaPorCodigo(codigo);
    if (!pista) {
      this.logger.warn('QR_INVALIDO', { idAnonimo, codigo });
      throw new QRInvalidoError(codigo);
    }

    let progresso = await this.progressos.obter(idAnonimo);
    if (!progresso) {
      progresso = new ProgressoCaca({
        idAnonimo,
        totalPistas: await this.obras.totalPistas(),
      });
    }

    const novaPista = progresso.registarPista(codigo);
    await this.progressos.guardar(progresso); // grava localmente (funciona offline)

    const completo = progresso.estaCompleto();
    const duracaoMs = Number((performance.now() - inicio).toFixed(2));
    this.logger.info('QR_LIDO', {
      idAnonimo,
      codigo,
      novaPista,
      pistasConcluidas: progresso.pistasConcluidas,
      completo,
      duracaoMs,
    });

    return {
      progresso,
      novaPista,
      enigma: pista.enigma,
      completo,
      premio: completo ? await this.obras.obterPremio() : null,
    };
  }
}