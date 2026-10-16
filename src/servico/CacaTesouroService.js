import { ProgressoCaca } from '../dominio/ProgressoCaca.js';
import { QRInvalidoError } from '../dominio/erros.js';

export class CacaTesouroService {
  /**
   * @param {{ obraRepository, progressoRepository }} deps  interfaces injetadas (ADR-0002)
   */
  constructor({ obraRepository, progressoRepository }) {
    this.obras = obraRepository;
    this.progressos = progressoRepository;
  }

  async lerQR(idAnonimo, codigo) {
    const pista = await this.obras.obterPistaPorCodigo(codigo);
    if (!pista) throw new QRInvalidoError(codigo);

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
    return {
      progresso,
      novaPista,
      enigma: pista.enigma,
      completo,
      premio: completo ? await this.obras.obterPremio() : null,
    };
  }
}
