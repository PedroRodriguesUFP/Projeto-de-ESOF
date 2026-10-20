import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RoteiroService, MIN_OBRAS, MAX_OBRAS } from '../src/servico/RoteiroService.js';
import { TempoInsuficienteError, ObrasInsuficientesError } from '../src/dominio/erros.js';
import { criarObraRepo } from './helpers.js';

// US01 - Roteiro por tempo
test('US01: roteiro de 30 min tem entre 5 e 7 obras e não ultrapassa 30 min', async () => {
  const roteiro = await new RoteiroService(criarObraRepo()).gerarRoteiro(30);
  assert.ok(roteiro.paragens.length >= MIN_OBRAS && roteiro.paragens.length <= MAX_OBRAS);
  assert.ok(roteiro.duracaoTotal() <= 30);
});

test('US01: o roteiro não repete obras e as paragens estão numeradas por ordem', async () => {
  const roteiro = await new RoteiroService(criarObraRepo()).gerarRoteiro(30);
  const ids = roteiro.paragens.map((p) => p.obra.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(roteiro.paragens.map((p) => p.ordem), ids.map((_, i) => i + 1));
});

test('US01: o percurso está ordenado por piso (sem voltas entre pisos)', async () => {
  const roteiro = await new RoteiroService(criarObraRepo()).gerarRoteiro(60);
  const pisos = roteiro.paragens.map((p) => p.obra.piso);
  assert.deepEqual(pisos, [...pisos].sort((a, b) => a - b));
});

test('US01: com mais tempo nunca passa de 7 obras', async () => {
  const roteiro = await new RoteiroService(criarObraRepo()).gerarRoteiro(120);
  assert.equal(roteiro.paragens.length, MAX_OBRAS);
});

test('US01: tempo curto lança TempoInsuficienteError com o mínimo sugerido', async () => {
  await assert.rejects(
    () => new RoteiroService(criarObraRepo()).gerarRoteiro(10),
    (erro) => {
      assert.ok(erro instanceof TempoInsuficienteError);
      assert.ok(erro.minutosMinimos > 10);
      return true;
    },
  );
});

test('US01: o mínimo sugerido permite mesmo gerar um roteiro', async () => {
  const servico = new RoteiroService(criarObraRepo());
  const erro = await servico.gerarRoteiro(10).catch((e) => e);
  const roteiro = await servico.gerarRoteiro(erro.minutosMinimos);
  assert.equal(roteiro.paragens.length, MIN_OBRAS);
});

// US06 - salas indisponíveis
test('US06: obras de salas fechadas para restauro nunca entram no roteiro', async () => {
  const roteiro = await new RoteiroService(criarObraRepo()).gerarRoteiro(120);
  const ids = roteiro.paragens.map((p) => p.obra.id);
  assert.ok(!ids.includes('O10') && !ids.includes('O11'));
});

test('US06: se as salas abertas tiverem menos de 5 obras, lança ObrasInsuficientesError', async () => {
  const repo = criarObraRepo((c) => {
    c.salas.forEach((s) => { if (s.id !== 'S1') s.estado = 'FECHADA_EVENTO'; });
    return c;
  });
  await assert.rejects(() => new RoteiroService(repo).gerarRoteiro(30), ObrasInsuficientesError);
});
