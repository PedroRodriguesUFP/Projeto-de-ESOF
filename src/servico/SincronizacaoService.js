import { loggerPadrao } from '../infra/Logger.js';

export class SincronizacaoService {
  /**
   * @param {{ progressoRepository, remoto: { enviarProgresso: (dados) => Promise<void> }, logger? }} deps
   */
  constructor({ progressoRepository, remoto, logger = loggerPadrao }) {
    this.progressos = progressoRepository;
    this.remoto = remoto;
    this.logger = logger;
  }

  /** Envia o progresso pendente. Se a rede falhar, mantém-no pendente e não lança erro. */
  async sincronizar() {
    const pendentes = await this.progressos.listarPorSincronizar();
    let enviados = 0;
    let falhados = 0;
    for (const progresso of pendentes) {
      try {
        await this.remoto.enviarProgresso(progresso.toJSON());
        progresso.marcarSincronizado();
        await this.progressos.guardar(progresso);
        enviados++;
        this.logger.info('PROGRESSO_SINCRONIZADO', { idAnonimo: progresso.idAnonimo });
      } catch (erro) {
        falhados++; // sem rede: tenta outra vez mais tarde
        this.logger.warn('SINCRONIZACAO_ADIADA_OFFLINE', {
          idAnonimo: progresso.idAnonimo,
          motivo: erro.message,
        });
      }
    }
    return { enviados, falhados };
  }
}