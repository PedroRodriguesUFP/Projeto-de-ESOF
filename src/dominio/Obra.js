export class Obra {
  constructor({ id, titulo, autor, descricao, minutosVisita, salaId, piso = 0, imagemUrl = null }) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.descricao = descricao;
    this.minutosVisita = minutosVisita; // tempo estimado de visita (minutos)
    this.salaId = salaId;
    this.piso = piso;
    this.imagemUrl = imagemUrl;  // copiado da sala, para ordenar o percurso
  }
}
