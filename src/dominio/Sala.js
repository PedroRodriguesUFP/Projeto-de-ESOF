export const EstadoSala = Object.freeze({
  ABERTA: 'ABERTA',
  FECHADA_RESTAURO: 'FECHADA_RESTAURO',
  FECHADA_EVENTO: 'FECHADA_EVENTO',
});

export class Sala {
  constructor({ id, nome, piso, estado = EstadoSala.ABERTA }) {
    this.id = id;
    this.nome = nome;
    this.piso = piso;
    this.estado = estado;
  }

  estaDisponivel() {
    return this.estado === EstadoSala.ABERTA;
  }
}
