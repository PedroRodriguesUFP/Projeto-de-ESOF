// M4 (OA7 / OA9): Análise estática de código, verificação de fronteiras arquiteturais (ADR-0002)
// e deteção de segredos expostos (RNF05). Zero dependências externas.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const problemas = [];

function listarFicheirosJS(dir) {
  if (!existsSync(dir)) return [];
  const resultado = [];
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    const stat = statSync(caminho);
    if (stat.isDirectory()) {
      resultado.push(...listarFicheirosJS(caminho));
    } else if (entrada.endsWith('.js')) {
      resultado.push(caminho);
    }
  }
  return resultado;
}

const ficheiros = [
  ...listarFicheirosJS(join(RAIZ, 'src')),
  ...listarFicheirosJS(join(RAIZ, 'tests')),
  ...listarFicheirosJS(join(RAIZ, 'scripts')),
];

// 1. Verificar se existe ficheiro .env indevidamente na árvore (RNF05)
if (existsSync(join(RAIZ, '.env'))) {
  const gitignore = existsSync(join(RAIZ, '.gitignore'))
    ? readFileSync(join(RAIZ, '.gitignore'), 'utf-8')
    : '';
  if (!gitignore.includes('.env')) {
    problemas.push('[RNF05 Segredos] Ficheiro .env existe mas não está listado no .gitignore!');
  }
}

// Padrões proibidos (segurança e qualidade)
const PADROES_PROIBIDOS = [
  { regex: /\beval\s*\(/, msg: 'Uso proibido de eval() (risco de injeção de código)' },
  { regex: /\bdebugger\b/, msg: 'Instrução debugger esquecida no código' },
  { regex: /(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35}|ghp_[0-9a-zA-Z]{36})/, msg: 'Possível chave de API/token hardcoded (viola RNF05)' },
];

for (const ficheiro of ficheiros) {
  const rel = relative(RAIZ, ficheiro).replace(/\\/g, '/');
  const conteudo = readFileSync(ficheiro, 'utf-8');

  // 2. Validação sintática rigorosa com node --check
  try {
    execFileSync(process.execPath, ['--check', ficheiro], { stdio: 'pipe' });
  } catch (erro) {
    problemas.push(`[Sintaxe] ${rel}: ${erro.stderr?.toString() || erro.message}`);
  }

  // 3. Regras de segurança e higiene de código (exceto no próprio script de análise)
  if (!rel.endsWith('static-analysis.js')) {
    for (const regra of PADROES_PROIBIDOS) {
      if (regra.regex.test(conteudo)) {
        problemas.push(`[Qualidade/Segurança] ${rel}: ${regra.msg}`);
      }
    }
  }

  // 4. Verificação de Fronteiras Arquiteturais (ADR-0002: dependências apenas cima -> baixo)
  if (rel.startsWith('src/dominio/')) {
    if (/from\s+['"]\.\.\/(servico|dados|apresentacao)\//.test(conteudo)) {
      problemas.push(`[ADR-0002 Camadas] ${rel}: A camada de domínio não pode depender de serviço, dados ou apresentação.`);
    }
  }

  if (rel.startsWith('src/servico/')) {
    if (/from\s+['"]\.\.\/(dados|apresentacao)\//.test(conteudo)) {
      problemas.push(`[ADR-0002 Inversão de Dependências] ${rel}: Os serviços devem receber repositórios por injeção e não importar implementações de src/dados/ diretamente.`);
    }
  }
}

if (problemas.length > 0) {
  console.error('Análise estática falhou com os seguintes problemas:');
  for (const p of problemas) console.error(`  - ${p}`);
  process.exit(1);
} else {
  console.log(`Análise estática concluída com sucesso (${ficheiros.length} ficheiros verificados: sintaxe, ADR-0002 e RNF05 OK).`);
}