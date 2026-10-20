import { ProgressoCaca } from '../dominio/ProgressoCaca.js';

/** Implementação em memória de ProgressoRepository (no M4+: IndexedDB). */
export class ProgressoRepositoryMemoria {
  constructor() {
    this.dados = new Map(); // guarda JSON, tal como o IndexedDB guardaria
  }

  async obter(idAnonimo) {
    const d = this.dados.get(idAnonimo);
    return d ? ProgressoCaca.fromJSON(d) : null;
  }

  async guardar(progresso) {
    this.dados.set(progresso.idAnonimo, progresso.toJSON());
  }

  async listarPorSincronizar() {
    return [...this.dados.values()]
      .filter((d) => !d.sincronizado)
      .map((d) => ProgressoCaca.fromJSON(d));
  }
}
