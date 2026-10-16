export class SincronizacaoService {
  /**
   * @param {{ progressoRepository, remoto: { enviarProgresso: (dados) => Promise<void> } }} deps
   */
  constructor({ progressoRepository, remoto }) {
    this.progressos = progressoRepository;
    this.remoto = remoto;
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
      } catch {
        falhados++; // sem rede: tenta outra vez mais tarde
      }
    }
    return { enviados, falhados };
  }
}
