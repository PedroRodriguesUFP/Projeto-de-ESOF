# M4 — Pipeline de CI, Análise Estática e Logging/Diagnóstico Básico

**Critério da FUC (semana 8):** Pipeline de CI + análise estática + logging/diagnóstico básico (OA7, OA9).

## 1. O que o M4 entrega

| Componente | Implementação | Requisito / Objetivo Suportado |
| --- | --- | --- |
| **Pipeline de CI** | `.github/workflows/ci.yml` (GitHub Actions em Node 20.x e 22.x) | OA9 — Integração contínua automática em cada Push e Pull Request |
| **Análise Estática** | `scripts/static-analysis.js` (`npm run lint`) | OA7, ADR-0002 (fronteiras de camadas) e RNF05 (deteção de segredos) |
| **Logging e Diagnóstico** | `src/infra/Logger.js` + integração nos serviços | OA7, RNF01 (medição de latência `< 1 s`) e RNF03 (anonimização RGPD nos logs) |
| **Testes de Observabilidade** | `tests/Logger.test.js` (3 novos testes, totalizando 20 testes) | OA7, OA8 — Verificação de logs `INFO`/`WARN` e redação de dados pessoais |

## 2. Como executar localmente

```bash
npm run lint      # corre a análise estática (sintaxe, regras ADR-0002 e verificação de segredos RNF05)
npm test          # corre os 20 testes automatizados (unitários, integração e logging)
npm run test:ci   # corre os testes com relatório de cobertura de código
npm run demo      # executa a demonstração com logging ativo