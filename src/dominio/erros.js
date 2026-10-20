// Erros de domínio: permitem à interface mostrar mensagens claras (sem depender de texto).

export class TempoInsuficienteError extends Error {
  constructor(minutosPedidos, minutosMinimos) {
    super(`Tempo insuficiente: ${minutosPedidos} min. Mínimo sugerido: ${minutosMinimos} min.`);
    this.name = 'TempoInsuficienteError';
    this.minutosMinimos = minutosMinimos; // usado pela UI para sugerir o ajuste
  }
}

export class ObrasInsuficientesError extends Error {
  constructor(disponiveis, necessarias) {
    super(`Só há ${disponiveis} obras disponíveis; são necessárias ${necessarias}.`);
    this.name = 'ObrasInsuficientesError';
  }
}

export class QRInvalidoError extends Error {
  constructor(codigo) {
    super(`QR não reconhecido: ${codigo}`);
    this.name = 'QRInvalidoError';
  }
}
