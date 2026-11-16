import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { carregarCatalogo } from './helpers.js';

const raiz = new URL('../', import.meta.url);

// US-03 / RNF01: cada obra tem dados reais e uma imagem local (disponível sem rede)
test('Catálogo: todas as obras têm título, autor, ano e imagem local em public/img/obras/', () => {
  const { obras } = carregarCatalogo();
  for (const obra of obras) {
    assert.ok(obra.titulo && !/exemplo/i.test(obra.titulo), `${obra.id} deve ter um título real`);
    assert.ok(obra.autor && obra.ano, `${obra.id} deve ter autor e ano`);
    assert.match(obra.imagem, /^public\/img\/obras\/O\d{2}\.jpg$/, `${obra.id} deve apontar para uma imagem local`);
  }
});

test('Catálogo: existe imagem genérica para quando a foto ainda não foi descarregada', () => {
  assert.ok(existsSync(new URL('public/img/obras/sem-imagem.svg', raiz)));
});
