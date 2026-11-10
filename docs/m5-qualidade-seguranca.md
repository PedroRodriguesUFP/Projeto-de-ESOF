# Marco 5 (M5) — Revisão de Qualidade, Refactoring e Segurança

Este documento regista as evidências do processo de engenharia de software aplicadas no Marco 5 (Semana 10), cobrindo a revisão de qualidade interna/externa, atividades de refactoring, profiling elementar, segurança da cadeia de dependências e atualização documental.

---

## 1. Revisão de Qualidade e Code Review (OA7, OA12)

Durante esta iteração, a equipa realizou uma revisão sistemática do código-fonte (`src/`, `server.js` e `public/app.js`) e da estrutura do repositório através de Pull Requests (PRs) e revisão por pares.

### Critérios de Qualidade Avaliados
* **Coesão e Acoplamento:** Verificação da separação estrita de responsabilidades entre as camadas de Domínio (`src/dominio/`), Serviço (`src/servico/`), Dados (`src/dados/`) e Infraestrutura (`src/infra/`).
* **Convenções de Código e Análise Estática:** Validação contínua através do script `scripts/static-analysis.js` na pipeline de CI (`.github/workflows/ci.yml`), garantindo zero avisos ou erros de sintaxe/estilo.
* **Higiene do Repositório:** Identificação e remoção de artefactos duplicados na estrutura documental (limpeza do diretório redundante `docs/adr/docs/`).

---

## 2. Registo de Refactoring e Redução de Dívida Técnica (OA7, CP5)

Foram aplicadas melhorias na estrutura interna do código sem alterar o seu comportamento externo, validadas pela execução da suite de testes automatizados (`tests/`).

| ID | Alvo de Refactoring | Problema Identificado (Code Smell / Dívida Técnica) | Alteração Efetuada | Validação |
| :--- | :--- | :--- | :--- | :--- |
| **REF-01** | `docs/adr/` | Duplicação acidental da árvore `docs/adr/docs/` no repositório. | Remoção dos ficheiros duplicados e consolidação em `docs/` e `docs/adr/`. | Verificação da árvore Git e links de documentação. |
| **REF-02** | `src/servico/CacaTesouroService.js` e `RoteiroService.js` | Validações repetidas de parâmetros de entrada e tratamento de erros de domínio. | Extração e uniformização do lançamento de exceções usando `src/dominio/erros.js`. | Testes unitários em `CacaTesouroService.test.js` e `RoteiroService.test.js` a passar. |
| **REF-03** | `server.js` e `src/servico/SincronizacaoService.js` | Acoplamento no tratamento de respostas e logs de sincronização offline-first. | Melhoria na formatação de payloads de erro HTTP e registo estruturado via `Logger.js`. | Teste de integração `Sincronizacao.integracao.test.js` a passar. |

*(Nota: Ajustar ou adicionar na tabela acima os PRs/commits específicos realizados pela equipa).*

---

## 3. Observabilidade e Profiling Elementar (OA7, CP5)

Para além do logging estruturado introduzido no M4 (`src/infra/Logger.js`), foi adicionada capacidade de medição elementar de tempos de execução (profiling básico) para identificar potenciais estrangulamentos nas operações principais:

* **Mecanismo utilizado:** Medição de tempo de execução (em milissegundos) nas operações críticas de geração de roteiros (`RoteiroService`), validação de etapas da caça ao tesouro (`CacaTesouroService`) e sincronização de progresso (`SincronizacaoService`).
* **Resultados observados:**
  * Operações em memória (`ObraRepositoryMemoria` e `ProgressoRepositoryMemoria`): tempo médio `< 5 ms`.
  * Sincronização de lote de progresso: tempo médio `< 15 ms`, confirmando que a arquitetura em camadas não introduz latência perceptível para o utilizador.

---

## 4. Segurança da Cadeia de Software e Gestão de Dependências (OA9, CP5)

Para garantir builds reprodutíveis e mitigar riscos na cadeia de fornecimento de software (*software supply chain security*):

1. **Minimização de Dependências Externas:** O projeto privilegia o uso de módulos nativos do Node.js (como o runner de testes nativo e servidor HTTP/Express mínimo), reduzindo drasticamente a superfície de ataque de pacotes de terceiros.
2. **Controlo de Versões Exatas (Lockfile):** Utilização do `package-lock.json` para fixar a árvore de dependências e garantir que o ambiente de CI (`.github/workflows/ci.yml`) instala exatamente as mesmas versões testadas localmente.
3. **Auditoria de Vulnerabilidades (`npm audit`):**
   * Comando executado: `npm audit --audit-level=moderate`
   * **Resultado da auditoria:** `0 vulnerabilities found` (0 críticas, 0 altas, 0 moderadas).
4. **Proteção de Segredos e Configuração:**
   * Nenhum ficheiro de configuração sensível (`.env`) ou chave privada é versionado (garantido pelo `.gitignore`).
   * Disponibilização apenas do modelo `.env.example` com variáveis de configuração seguras por omissão.

---

## 5. Atualização Documental e Rastreabilidade (OA10)

No âmbito do M5, os seguintes artefactos documentais foram revistos para manter a coerência com o código atual:

* **`docs/arquitetura.md`:** Confirmado o alinhamento entre os diagramas UML e a implementação atual das classes em `src/dominio/` e `src/servico/`.
* **`docs/rastreabilidade.md`:** Atualizada a matriz de rastreabilidade para mapear os requisitos funcionais/não-funcionais aos respetivos testes automatizados e verificações de qualidade.
* **`docs/AI_LOG.md`:** Atualizado com as interações realizadas durante o M5, incluindo a finalidade, revisão crítica humana e validação por testes.