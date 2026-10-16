import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CacaTesouroService } from '../src/servico/CacaTesouroService.js';
import { SincronizacaoService } from '../src/servico/SincronizacaoService.js';
import { ProgressoRepositoryMemoria } from '../src/dados/ProgressoRepositoryMemoria.js';
import { criarObraRepo } from './helpers.js';

// Teste de integração (serviços + repositórios reais em memória + servidor falso)
// US04 - Offline: ler QR sem rede e sincronizar quando a rede regressa.
function cenario({ redeDisponivel }) {
  const enviados = [];
  const estado = { rede: redeDisponivel };
  const remoto = {
    async enviarProgresso(dados) {
      if (!estado.rede) throw new Error('Sem rede');
      enviados.push(dados);
    },
  };
  const progressoRepository = new ProgressoRepositoryMemoria();
  const caca = new CacaTesouroService({ obraRepository: criarObraRepo(), progressoRepository });
  const sync = new SincronizacaoService({ progressoRepository, remoto });
  return { caca, sync, progressoRepository, enviados, estado };
}

test('US04: sem rede, ler QR funciona localmente e fica pendente de sincronização', async () => {
  const { caca, sync, progressoRepository, enviados } = cenario({ redeDisponivel: false });
  const inicio = performance.now();
  await caca.lerQR('visitante-1', 'QR-001');
  assert.ok(performance.now() - inicio < 1000, 'resposta local deve ser < 1 s (RNF01)');

  const resultado = await sync.sincronizar();
  assert.deepEqual(resultado, { enviados: 0, falhados: 1 });
  assert.equal(enviados.length, 0);
  assert.equal((await progressoRepository.listarPorSincronizar()).length, 1);
});

test('US04: quando a rede regressa, o progresso pendente é enviado e deixa de estar pendente', async () => {
  const { caca, sync, progressoRepository, enviados, estado } = cenario({ redeDisponivel: false });
  await caca.lerQR('visitante-1', 'QR-001');
  await caca.lerQR('visitante-1', 'QR-002');
  await sync.sincronizar(); // falha (offline)

  estado.rede = true;
  const resultado = await sync.sincronizar();
  assert.deepEqual(resultado, { enviados: 1, falhados: 0 });
  assert.deepEqual(enviados[0].pistas, ['QR-001', 'QR-002']);
  assert.equal((await progressoRepository.listarPorSincronizar()).length, 0);
});

test('US04: sincronizar sem nada pendente não envia nada', async () => {
  const { sync } = cenario({ redeDisponivel: true });
  assert.deepEqual(await sync.sincronizar(), { enviados: 0, falhados: 0 });
});
