# M4 — Pipeline de CI, análise estática e logging/diagnóstico básico

**Critério da FUC (semana 8):** pipeline de CI, análise estática e logging/diagnóstico básico (OA7, OA9).

## 1. Entregáveis e estado observado

| Componente | Implementação no repositório | Evidência / âmbito |
| --- | --- | --- |
| Integração contínua | `.github/workflows/ci.yml` | GitHub Actions nos pushes (`main`, `master`, `feature/**`, `fix/**`) e PRs para `main`/`master`; matriz Node.js 20.x e 22.x |
| Análise estática | `scripts/static-analysis.js` (`npm run lint`) | Verifica sintaxe JS com `node --check`, alguns padrões de código e segredos, e regras de dependências de camadas da ADR-0002 |
| Logging e diagnóstico | `src/infra/Logger.js` | Níveis `DEBUG`, `INFO`, `WARN`, `ERROR`; contexto estruturado, máscara de campos pessoais conhecidos e medição de duração de operações |
| Testes de logging | `tests/Logger.test.js` | Três testes adicionais aos 17 documentados no M3; total documentado no M4: **20 testes** |
| Testes com cobertura | `npm run test:ci` | Executa `node --test --experimental-test-coverage` e produz informação de cobertura no terminal; não estabelece limiar mínimo de cobertura |
| Demonstração | `npm run demo` | Executa a demonstração do núcleo em JavaScript, não uma interface PWA completa |

A execução da CI do commit de documentação de **21-10-2026** terminou com sucesso: [GitHub Actions — execução 39670017458](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/actions/runs/39670017458). Este resultado confirma a execução bem-sucedida das tarefas da pipeline nesse commit, **não** a implementação de toda a aplicação ou o cumprimento integral dos RNF.

## 2. Como executar localmente

Pré-requisito: **Node.js ≥ 20**, na raiz do projeto.

```bash
npm run lint       # sintaxe, regras arquiteturais e padrões de segurança configurados
npm test           # testes automatizados existentes (20 no estado documentado do M4)
npm run test:ci    # testes com relatório de cobertura no terminal
npm run demo       # demonstração do núcleo (serviços, não interface gráfica)
```

> Nota: no `package.json`, o comando `demo` define `LOG_LEVEL=INFO` na própria linha de comando, sintaxe adequada aos ambientes Unix/Linux usados pela CI. Em PowerShell, pode ser necessário adaptar a definição da variável de ambiente.

## 3. Ligação aos requisitos e à arquitetura

- **US-01** (issue #5): o serviço de roteiros é exercitado por testes, mas não existe ainda a interface completa do visitante.
- **US-02** (issue #6) e **RNF01**: a medição de latência no núcleo e o teste de sincronização não substituem uma validação real da PWA sem ligação. IndexedDB, Service Worker e indicador «Modo Offline» continuam pendentes.
- **US-04** (issue #8) e **US-05** (issue #9): estão cobertas regras de domínio da caça ao tesouro; a leitura QR via câmara e o ecrã de prémio ainda não são demonstrados pela CI.
- **RNF03**: o `Logger` mascara os campos conhecidos `nome`, `email`, `telefone`, `nif`, `password`, `token`, `apikey` e encurta `idAnonimo`. Não equivale a uma auditoria integral de privacidade nem garante ocultação de todos os dados sensíveis em mensagens arbitrárias.
- **RNF05**: a análise estática procura determinados padrões de tokens e verifica condições em torno do `.env`; não substitui uma ferramenta de auditoria de segredos abrangente.
- **ADR-0002**: são verificadas determinadas dependências entre as pastas `src/dominio`, `src/servico` e as restantes camadas; não se trata de uma prova formal de todas as restrições arquiteturais.

## 4. Limites e trabalho futuro

1. Falta validar a experiência offline **end-to-end** numa PWA real.
2. Ainda não está demonstrada uma API REST nem o requisito **RNF02** (300 utilizadores em simultâneo).
3. O assistente **US-06** ainda não está implementado; a CI não comprova a qualidade de respostas RAG.
4. É necessário rever vulnerabilidades e dependências, efetuar refactoring e rever o código entre colegas nos marcos seguintes (M5/M6).
5. Guardar evidências de validação humana e dos resultados da CI; documentar alterações ao código e testes num PR.

## 5. Relação com os restantes documentos

- [`m3-incremento.md`](m3-incremento.md): histórico do núcleo e dos **17 testes originalmente documentados no M3**.
- [`requisitos.md`](requisitos.md): IDs canónicos `US-01` a `US-06` das issues do GitHub e `RNF01`–`RNF05`.
- [`rastreabilidade.md`](rastreabilidade.md): estado parcial ou pendente de cada requisito.
- [`arquitetura.md`](arquitetura.md) e [`adr/`](adr/): modelos e decisões, distinguindo a arquitetura proposta da implementação atual.
- [`AI_LOG.md`](AI_LOG.md): histórico e declaração da utilização de IA, incluindo revisão documental.
