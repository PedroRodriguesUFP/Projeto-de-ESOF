import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CacaTesouroService } from '../src/servico/CacaTesouroService.js';
import { ProgressoRepositoryMemoria } from '../src/dados/ProgressoRepositoryMemoria.js';
import { QRInvalidoError } from '../src/dominio/erros.js';
import { gerarIdAnonimo } from '../src/dominio/Visitante.js';
import { criarObraRepo } from './helpers.js';

function criarServico() {
  const progressoRepository = new ProgressoRepositoryMemoria();
  const servico = new CacaTesouroService({ obraRepository: criarObraRepo(), progressoRepository });
  return { servico, progressoRepository, id: gerarIdAnonimo() };
}

// US02 - Caça ao tesouro
test('US02: QR válido regista a pista e devolve o enigma', async () => {
  const { servico, id } = criarServico();
  const r = await servico.lerQR(id, 'QR-001');
  assert.equal(r.novaPista, true);
  assert.equal(r.progresso.pistasConcluidas, 1);
  assert.equal(r.enigma, 'Enigma de exemplo 1');
  assert.equal(r.completo, false);
  assert.equal(r.premio, null);
});

test('US02: QR inválido lança QRInvalidoError e não altera o progresso', async () => {
  const { servico, progressoRepository, id } = criarServico();
  await assert.rejects(() => servico.lerQR(id, 'QR-XXX'), QRInvalidoError);
  assert.equal(await progressoRepository.obter(id), null);
});

test('US02: ler o mesmo QR duas vezes não conta duas vezes', async () => {
  const { servico, id } = criarServico();
  await servico.lerQR(id, 'QR-001');
  const r = await servico.lerQR(id, 'QR-001');
  assert.equal(r.novaPista, false);
  assert.equal(r.progresso.pistasConcluidas, 1);
});

test('US02: completar todas as pistas desbloqueia o prémio', async () => {
  const { servico, id } = criarServico();
  await servico.lerQR(id, 'QR-001');
  await servico.lerQR(id, 'QR-002');
  const r = await servico.lerQR(id, 'QR-003');
  assert.equal(r.completo, true);
  assert.match(r.premio.descricao, /Prémio/);
});

test('US02: o progresso fica guardado e mantém-se entre leituras', async () => {
  const { servico, progressoRepository, id } = criarServico();
  await servico.lerQR(id, 'QR-001');
  const guardado = await progressoRepository.obter(id);
  assert.equal(guardado.pistasConcluidas, 1);
});

// US05 - Privacidade (RNF03)
test('US05: o progresso guardado só contém dados anónimos', async () => {
  const { servico, id } = criarServico();
  const r = await servico.lerQR(id, 'QR-001');
  assert.deepEqual(Object.keys(r.progresso.toJSON()).sort(),
    ['idAnonimo', 'pistas', 'sincronizado', 'totalPistas']);
  assert.match(id, /^[0-9a-f-]{36}$/); // UUID, sem dados pessoais
});
