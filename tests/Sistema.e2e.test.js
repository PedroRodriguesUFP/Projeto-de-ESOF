import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raizProjeto = path.resolve(__dirname, '..');

test('Teste de Sistema (E2E): Fluxo completo de visita ao museu e verificacao de artefactos', () => {
  // 1. Verificar integridade dos artefactos estaticos do sistema (Catalogo e Frontend PWA)
  const caminhoCatalogo = path.join(raizProjeto, 'data', 'catalogo-exemplo.json');
  const caminhoIndexHtml = path.join(raizProjeto, 'public', 'index.html');
  const caminhoAppJs = path.join(raizProjeto, 'public', 'app.js');

  assert.ok(fs.existsSync(caminhoCatalogo), 'Catalogo JSON deve existir no sistema');
  assert.ok(fs.existsSync(caminhoIndexHtml), 'Interface publica index.html deve existir');
  assert.ok(fs.existsSync(caminhoAppJs), 'Script frontend app.js deve existir');

  const dadosCatalogo = JSON.parse(fs.readFileSync(caminhoCatalogo, 'utf-8'));
  assert.ok(dadosCatalogo, 'Catalogo deve ser um JSON valido');

  // 2. Executar o fluxo completo de demonstracao do sistema (src/demo.js) de ponta a ponta
  const caminhoDemo = path.join(raizProjeto, 'src', 'demo.js');
  const outputDemo = execFileSync(process.execPath, [caminhoDemo], {
    cwd: raizProjeto,
    encoding: 'utf-8'
  });

  assert.ok(outputDemo.length > 0, 'A execucao do sistema (demo.js) deve produzir output valido');
});