import { Obra } from '../dominio/Obra.js';
import { Sala } from '../dominio/Sala.js';

/**
 * Implementação em memória de ObraRepository (M3).
 * No M4+ será complementada por ObraLocalRepository (IndexedDB) e ObraRemoteRepository (API).
 */
export class ObraRepositoryMemoria {
  constructor(catalogo) {
    this.salas = new Map(catalogo.salas.map((s) => [s.id, new Sala(s)]));
    this.obras = catalogo.obras.map(
      (o) => new Obra({ ...o, piso: this.salas.get(o.salaId)?.piso ?? 0 }),
    );
    this.pistas = new Map(catalogo.pistas.map((p) => [p.codigo, p]));
    this.premio = catalogo.premio;
  }

  async listarObrasDisponiveis() {
    return this.obras.filter((o) => this.salas.get(o.salaId)?.estaDisponivel());
  }

  async obterPorId(id) {
    return this.obras.find((o) => o.id === id) ?? null;
  }

  async obterPistaPorCodigo(codigo) {
    return this.pistas.get(codigo) ?? null;
  }

  async totalPistas() {
    return this.pistas.size;
  }

  async obterPremio() {
    return this.premio;
  }
}
