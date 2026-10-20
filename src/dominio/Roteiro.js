export class ParagemRoteiro {
  constructor(ordem, obra) {
    this.ordem = ordem;
    this.obra = obra;
    this.minutos = obra.minutosVisita;
  }
}

export class Roteiro {
  constructor(minutosDisponiveis) {
    this.minutosDisponiveis = minutosDisponiveis;
    this.paragens = [];
  }

  adicionarParagem(obra) {
    this.paragens.push(new ParagemRoteiro(this.paragens.length + 1, obra));
  }

  duracaoTotal() {
    return this.paragens.reduce((soma, p) => soma + p.minutos, 0);
  }
}
