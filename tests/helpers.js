import { readFileSync } from 'node:fs';
import { ObraRepositoryMemoria } from '../src/dados/ObraRepositoryMemoria.js';

export function carregarCatalogo() {
  const url = new URL('../data/catalogo-exemplo.json', import.meta.url);
  return JSON.parse(readFileSync(url, 'utf-8'));
}

export function criarObraRepo(alterar = (c) => c) {
  return new ObraRepositoryMemoria(alterar(carregarCatalogo()));
}
