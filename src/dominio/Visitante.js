/** Identificador anónimo gerado no dispositivo (nunca contém dados pessoais). */
export function gerarIdAnonimo() {
  return globalThis.crypto.randomUUID();
}
