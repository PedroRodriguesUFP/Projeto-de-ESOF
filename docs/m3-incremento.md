# M3 — Incremento executável, testes automatizados e histórico Git

**Critério da FUC (semana 6):** incremento executável + testes automatizados mínimos + histórico Git inteligível.

> **Nota de atualização (21/10/2026):** este documento mantém o registo histórico da entrega M3 (17 testes). O M4 acrescentou análise estática, CI, logging e mais 3 testes, elevando o total para **20 testes**. Ver [`m4-ci-qualidade.md`](m4-ci-qualidade.md). Os IDs das user stories abaixo seguem as [issues originais do backlog](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues), não a numeração provisória usada em versões antigas da documentação.

## 1. O que o incremento M3 entrega

O M3 entrega o núcleo de domínio e serviços da aplicação **sem interface gráfica**. A PWA completa, o IndexedDB e o Service Worker não estão incluídos neste incremento.

| Requisito do backlog | Estado no M3 | Evidência |
| --- | --- | --- |
| **US-01 — Gerar roteiro por tempo** | Lógica implementada; sem ecrã para o visitante | `src/servico/RoteiroService.js` |
| **US-02 — Consultar roteiro offline** | Parcial: lógica de sincronização; sem armazenamento persistente em IndexedDB nem Service Worker | `src/servico/SincronizacaoService.js` |
| **US-03 — Ver ficha da obra O Desterro** | Não demonstrada como ficha de interface completa | `src/dominio/Obra.js`; dados de exemplo em `data/catalogo-exemplo.json` |
| **US-04 — Ler QR Code e desbloquear pista** | Lógica de validação e registo implementada; falta a leitura por câmara/UI | `src/servico/CacaTesouroService.js`, `src/dominio/ProgressoCaca.js` |
| **US-05 — Receber recompensa ao concluir a caça** | Lógica de atribuição implementada; falta ecrã de recompensa | `src/servico/CacaTesouroService.js` |
| **US-06 — Perguntar ao assistente sobre uma obra** | Não iniciado | — |

**Requisitos transversais:** o progresso usa um identificador anónimo (RNF03, parcialmente coberto); o roteiro exclui obras/salas indisponíveis (regra de negócio representada nos testes). Isto **não significa** que exista ainda uma interface/API de gestão de salas ou uma política de consentimento completa.

## 2. Como executar

Requer **Node.js ≥ 20**. O projeto usa o *test runner* incluído no Node e não exige dependências externas.

```bash
npm run lint       # disponível desde o M4: análise estática
npm test           # estado atual: 20 testes automatizados (17 no M3)
npm run test:ci    # disponível desde o M4: testes com relatório de cobertura
npm run demo       # demonstra o núcleo de roteiros, caça e sincronização
```

> No M3, os comandos principais eram `npm test` (17 testes) e `npm run demo`. Os comandos de qualidade foram acrescentados depois.

## 3. Testes e rastreabilidade

### 3.1 Testes incluídos no M3 (17)

| Ficheiro | Tipo | Funcionalidade / requisito | Nº |
| --- | --- | --- | ---: |
| `tests/RoteiroService.test.js` | Unitário | US-01; exclusão de obras indisponíveis | 8 |
| `tests/CacaTesouroService.test.js` | Unitário | US-04, US-05; identificador anónimo (RNF03) | 6 |
| `tests/Sincronizacao.integracao.test.js` | Integração | US-02; lógica de sincronização, RNF01 | 3 |
| **Total M3** | | | **17** |

### 3.2 Testes acrescentados no M4

| Ficheiro | Tipo | Objetivo | Nº |
| --- | --- | --- | ---: |
| `tests/Logger.test.js` | Unitário | Logging e proteção de dados sensíveis | 3 |
| **Total acumulado até M4** | | | **20** |

Casos abordados no núcleo: roteiro de 30 minutos com 5 a 7 obras e duração dentro do limite; exclusão de obras indisponíveis; rejeição de QR inválido e repetido; recompensa quando a caça termina; progresso pendente para sincronização; medição de resposta local; utilização de ID anónimo. **Não equivalem a testes da PWA offline completa**, que ainda requer IndexedDB e Service Worker.

## 4. Desvios e evolução face ao desenho do M2

- O `ObraRepository` passou a ter operações necessárias à caça ao tesouro, incluindo `totalPistas()` e `obterPremio()`. Confirmar que o diagrama das interfaces em `arquitetura.md` reflete as assinaturas efetivamente implementadas.
- A gestão de salas indisponíveis é tratada no núcleo de seleção de obras; `GestaoSalasService` e a interface de gestão continuam previstos, mas não implementados.
- A linguagem escolhida foi **JavaScript com ES modules**, coerente com a evolução prevista para uma PWA.
- A persistência atual do incremento usa repositórios em memória. Persistência em IndexedDB, Service Worker e API REST continuam por implementar.
- As referências antigas `US01`–`US06` foram alinhadas nesta revisão com as issues do backlog. Isto altera as **etiquetas documentais**, não as funcionalidades implementadas.

## 5. Limitações ainda existentes

- O algoritmo de roteiros privilegia as obras de visita mais curta; falta explorar preferências e percursos temáticos.
- O catálogo em `data/catalogo-exemplo.json` é ilustrativo; falta validação e integração de dados reais do museu.
- É necessário definir a regra para QR Codes em salas temporariamente fechadas.
- Não existe PWA completa nem demonstração real de persistência offline após reiniciar a aplicação.
- Falta o assistente IA/RAG da US-06 e faltam interfaces de utilização para as outras histórias.
- O M4 **acrescentou** a análise estática, CI, logging e cobertura; estas já não são limitações do estado atual, embora não fizessem parte do M3 original.

## 6. Registo de trabalho e histórico Git

O plano original previa commits pequenos por componente (domínio, acesso a dados, serviços, testes e demonstração), em branch de funcionalidade, seguidos de Pull Request e revisão. A equipa deve usar o histórico real do GitHub como evidência — a lista planeada de commits não substitui a verificação dos commits e revisões que efetivamente ocorreram.

Para consultar o histórico:

```bash
git log --oneline --decorate --all
```

Recomenda-se relacionar os próximos Pull Requests com as issues correspondentes, distinguir funcionalidades parciais de completas e pedir revisão de um colega antes de integrar em `master`.

## 7. Checklist de validação atual

- [ ] Executar `npm test` e confirmar os **20 testes** no código atual.
- [ ] Executar `npm run lint` e `npm run test:ci`.
- [ ] Executar `npm run demo` e conseguir explicar os resultados.
- [ ] Validar que `docs/requisitos.md`, `docs/rastreabilidade.md` e `docs/arquitetura.md` usam os IDs das issues `US-01` a `US-06`.
- [ ] Confirmar revisão por pares nos Pull Requests relevantes.
- [ ] Atualizar o `AI_LOG.md` com as alterações documentais feitas e as verificações humanas efetivas.
- [ ] Assinalar nas issues o que está implementado, parcial ou pendente, sem fechar histórias ainda incompletas.

**Nota:** esta checklist serve para orientar a validação pela equipa; as caixas não foram marcadas como concluídas automaticamente.
