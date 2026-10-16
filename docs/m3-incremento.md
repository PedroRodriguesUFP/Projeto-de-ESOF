# M3 — Incremento executável, testes automatizados e histórico Git

**Critério da FUC (semana 6):** incremento executável + testes automatizados mínimos + histórico Git inteligível.

## 1. O que o incremento entrega

Núcleo de domínio e serviços da app, **sem interface gráfica** (a PWA e o IndexedDB ficam para M4+):

| Requisito | Estado no M3 | Onde |
| --- | --- | --- |
| US01 Roteiro por tempo | Implementado | `src/servico/RoteiroService.js` |
| US02 Caça ao tesouro (QR) | Implementado | `src/servico/CacaTesouroService.js`, `src/dominio/ProgressoCaca.js` |
| US04 Offline | Lógica implementada (guardar localmente + sincronizar depois); falta IndexedDB e Service Worker | `src/servico/SincronizacaoService.js` |
| US05 RGPD | Parcial: progresso só com ID anónimo (testado); falta consentimento/política | `src/dominio/ProgressoCaca.js` |
| US06 Gestão de salas | Parcial: salas fechadas nunca entram em roteiros; falta o ecrã/API do gestor | `src/dados/ObraRepositoryMemoria.js` |
| US03 Assistente IA | **Não iniciado** | — |

## 2. Como executar

Requer Node.js ≥ 20 e **não tem dependências** (usa o *test runner* do próprio Node).

```bash
npm test        # corre os 17 testes automatizados
npm run demo    # demonstração: roteiro de 30 min + caça ao tesouro offline + sincronização
```

## 3. Testes (17) e rastreabilidade

| Ficheiro | Tipo | Requisitos | Nº |
| --- | --- | --- | --- |
| `tests/RoteiroService.test.js` | Unitário | US01, US06 | 8 |
| `tests/CacaTesouroService.test.js` | Unitário | US02, US05 | 6 |
| `tests/Sincronizacao.integracao.test.js` | Integração | US04, RNF01 | 3 |

Casos importantes: roteiro de 30 min com 5–7 obras e ≤ 30 min; obras de salas em restauro nunca selecionadas; QR inválido; QR repetido não conta duas vezes; prémio ao completar; offline → pendente → sincroniza; resposta local < 1 s; dados do progresso só anónimos.

## 4. Desvios face ao M2 (a refletir na documentação)

- `ObraRepository` ganhou `totalPistas()` e `obterPremio()` (necessários para a caça ao tesouro). **Atualizar o diagrama de classes de serviço em `arquitetura.md`.**
- `GestaoSalasService` ainda não existe: o filtro de salas fechadas está no repositório. Decidir no M4 se se cria o serviço.
- Linguagem: JavaScript (ES modules) por coerência com a PWA do ADR-0001. O `.gitignore` do repositório é de Java: **confirmar a stack com a equipa** (ver secção 6).
- Repositórios em memória; os de IndexedDB e API REST ficam para M4+.

## 5. Limitações conhecidas

- O algoritmo escolhe sempre as obras mais curtas primeiro (resultado determinístico, mas pouco variado; melhorar com preferências/temas).
- Dados do catálogo são **de exemplo** (`data/catalogo-exemplo.json`); falta o catálogo real do MNSR.
- Ler um QR de uma sala fechada continua a ser aceite (decisão por tomar).
- Sem verificação de cobertura de testes nem análise estática (M4).

## 6. Plano Git (histórico inteligível)

Antes de começar: fazer *merge* do M2 (ver correções ao `README.md` e `EQUIPA.md`). Depois:

```bash
git checkout master && git pull
git checkout -b feature/m3-nucleo-roteiros-caca
```

Commits pequenos, um por ideia (convenção *Conventional Commits*):

1. `chore: adiciona package.json e ignora node_modules`
2. `feat(dominio): adiciona Obra, Sala, Roteiro, ProgressoCaca e erros`
3. `feat(dados): adiciona repositórios em memória e catálogo de exemplo`
4. `feat(servico): adiciona RoteiroService (US01, US06)`
5. `test(servico): adiciona testes unitários do RoteiroService`
6. `feat(servico): adiciona CacaTesouroService (US02, US05)`
7. `test(servico): adiciona testes unitários da caça ao tesouro`
8. `feat(servico): adiciona SincronizacaoService e teste de integração (US04)`
9. `feat: adiciona demo executável`
10. `docs: adiciona m3-incremento.md e atualiza AI_LOG e rastreabilidade`

Depois: `git push -u origin feature/m3-nucleo-roteiros-caca`, abrir PR a referenciar as issues (`Closes #n`) e pedir revisão a um colega antes do *merge*.

## 7. Checklist de entrega do M3

- [ ] `npm test` passa na tua máquina (17/17) e `npm run demo` corre
- [ ] Sabes explicar cada ficheiro e alterar uma regra (ex.: mudar MAX_OBRAS e ver que teste falha)
- [ ] PR com revisão de outro membro; sem *commits* diretos no `master`
- [ ] AI_LOG com nova linha M3.1 preenchida com o que fizeste de facto
- [ ] README atualizado com secção "Instalação" (`npm test`, `npm run demo`)
- [ ] Issues do M3 criadas e fechadas pelas PRs
