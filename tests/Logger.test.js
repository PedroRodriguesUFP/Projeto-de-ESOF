import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Logger, NivelLog } from '../src/infra/Logger.js';
import { CacaTesouroService } from '../src/servico/CacaTesouroService.js';
import { ProgressoRepositoryMemoria } from '../src/dados/ProgressoRepositoryMemoria.js';
import { criarObraRepo } from './helpers.js';

// M4 - Logging, diagnóstico básico e privacidade nos logs (OA7, RNF01, RNF03)
test('M4 (Logging): regista eventos de leitura de QR e tempo de resposta (RNF01)', async () => {
  const logger = new Logger({ componente: 'TesteCaca', nivelMinimo: NivelLog.DEBUG });
  const servico = new CacaTesouroService({
    obraRepository: criarObraRepo(),
    progressoRepository: new ProgressoRepositoryMemoria(),
    logger,
  });

  await servico.lerQR('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'QR-001');

  assert.equal(logger.registos.length, 1);
  assert.equal(logger.registos[0].evento, 'QR_LIDO');
  assert.equal(logger.registos[0].nivel, 'INFO');
  assert.ok(typeof logger.registos[0].contexto.duracaoMs === 'number');
  assert.ok(logger.registos[0].contexto.duracaoMs < 1000);
});

test('M4 (Logging): QR inválido gera log de nível WARN para diagnóstico', async () => {
  const logger = new Logger({ componente: 'TesteCaca', nivelMinimo: NivelLog.DEBUG });
  const servico = new CacaTesouroService({
    obraRepository: criarObraRepo(),
    progressoRepository: new ProgressoRepositoryMemoria(),
    logger,
  });

  await assert.rejects(() => servico.lerQR('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'QR-INEXISTENTE'));
  assert.equal(logger.registos.length, 1);
  assert.equal(logger.registos[0].nivel, 'WARN');
  assert.equal(logger.registos[0].evento, 'QR_INVALIDO');
});

test('M4 (RGPD / RNF03): o Logger mascara o UUID completo e oculta campos pessoais', () => {
  const logger = new Logger({ nivelMinimo: NivelLog.INFO });
  logger.info('EVENTO_TESTE', {
    idAnonimo: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    email: 'visitante@exemplo.pt',
    nome: 'João Silva',
    token: 'segredo-123',
  });

  const ctx = logger.registos[0].contexto;
  assert.equal(ctx.idAnonimo, 'anon-f47ac10b');
  assert.equal(ctx.email, '[REDACTED_RGPD]');
  assert.equal(ctx.nome, '[REDACTED_RGPD]');
  assert.equal(ctx.token, '[REDACTED_RGPD]');
});