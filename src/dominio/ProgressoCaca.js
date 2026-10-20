// RNF03 (privacidade): o progresso só contém um identificador anónimo e os códigos das pistas.
export class ProgressoCaca {
  constructor({ idAnonimo, totalPistas, pistas = [], sincronizado = true }) {
    this.idAnonimo = idAnonimo;
    this.totalPistas = totalPistas;
    this.pistas = new Set(pistas);
    this.sincronizado = sincronizado;
  }

  /** Regista a pista. Devolve true se for nova, false se já estava registada (idempotente). */
  registarPista(codigo) {
    if (this.pistas.has(codigo)) return false;
    this.pistas.add(codigo);
    this.sincronizado = false; // há alterações por enviar ao servidor
    return true;
  }

  get pistasConcluidas() {
    return this.pistas.size;
  }

  estaCompleto() {
    return this.totalPistas > 0 && this.pistas.size >= this.totalPistas;
  }

  marcarSincronizado() {
    this.sincronizado = true;
  }

  toJSON() {
    return {
      idAnonimo: this.idAnonimo,
      pistas: [...this.pistas],
      totalPistas: this.totalPistas,
      sincronizado: this.sincronizado,
    };
  }

  static fromJSON(dados) {
    return new ProgressoCaca(dados);
  }
}
