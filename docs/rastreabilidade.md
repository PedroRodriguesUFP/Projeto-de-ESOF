# Matriz de rastreabilidade — MNSR Digital (M2–M4)

Relação entre as [issues do backlog](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues), requisitos, desenho, implementação e verificação. Os IDs `US-01` a `US-06` são os das issues originais. Os estados referem-se ao núcleo do repositório observado em 21-10-2026, não à conclusão integral dos critérios de aceitação.

| Requisito (issue) | Modelo / desenho | Implementação existente | Evidência e testes | Estado / falta fazer |
| --- | --- | --- | --- | --- |
| **US-01** [#5](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/5) — roteiro por tempo | `Roteiro`, `Obra`, `RoteiroService`; sequência §4.1 | `src/servico/RoteiroService.js`, `src/dados/ObraRepositoryMemoria.js` | `tests/RoteiroService.test.js` (30 min, 5–7 obras, indisponíveis) | **Parcial**: existe núcleo de negócio; falta interface de seleção 30/60/90 min e validação completa na aplicação |
| **US-02** [#6](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/6) — consultar roteiro offline | PWA, cache local, sequência §4.1 | `SincronizacaoService.js` (lógica de sincronização); armazenamento em memória | `tests/Sincronizacao.integracao.test.js` testa cenários do serviço | **Parcial**: faltam persistência IndexedDB, Service Worker, cache de roteiros e indicador «Modo Offline» |
| **US-03** [#7](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/7) — ficha de O Desterro | `Obra`, ecrã de ficha; secção §1 | Modelo `Obra.js` e catálogo de exemplo | **Ainda não há teste específico** da ficha completa | **Pendente**: faltam ecrã, dados reais/curados, áudio/fotos e fallback do áudio offline |
| **US-04** [#8](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/8) — QR desbloqueia pista | `PistaQR`, `ProgressoCaca`, `CacaTesouroService`; §4.2 | `src/servico/CacaTesouroService.js`, `src/dominio/ProgressoCaca.js` | `tests/CacaTesouroService.test.js` (QR válido/inválido) | **Parcial**: lógica implementada, falta leitura de QR pela interface/câmara e persistência real |
| **US-05** [#9](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/9) — recompensa | `ProgressoCaca`, `Premio`; §4.2 | `CacaTesouroService.js`, repositórios em memória | `tests/CacaTesouroService.test.js` (conclusão e prémio) | **Parcial**: regra da recompensa implementada; falta ecrã de prémios |
| **US-06** [#10](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/10) — assistente IA | `RespostaAssistente`, `AssistenteService` e gateway (propostos); §4.3 | Sem serviço de IA no código atual | Testes previstos com contexto curado e perguntas fora do domínio | **Pendente**: serviço, fontes documentais, verificações e interface |
| **RNF01** — offline em menos de 1 s | Cache local e sincronização | Lógica em memória | Teste de integração de sincronização | **Parcial**: falta medição end-to-end offline na PWA |
| **RNF02** — 300 utilizadores | API/servidor propostos | API não identificada no núcleo atual | Teste de carga previsto | **Pendente** |
| **RNF03** — privacidade | Identificador anónimo / minimização | `ProgressoCaca.js`, `Logger.js` | Testes do progresso e Logger | **Parcial**: falta rever privacidade na aplicação completa |
| **RNF04** — acervo curado e obras disponíveis | `RoteiroService`, assistente proposto | Filtro de obras indisponíveis no roteiro | `RoteiroService.test.js` | **Parcial**: componente IA por implementar |
| **RNF05** — segredos fora do Git | Variáveis de ambiente e verificação estática | `.env.example`, `scripts/static-analysis.js` | `npm run lint` integrado na CI | **Implementado ao nível do repositório**; manter verificação contínua |

## Notas de consistência

- O nome `US01` em algumas descrições históricas de M3 designava *roteiro por tempo* e corresponde a **US-01**.
- O nome antigo `US02` em documentos técnicos de M2/M3 designava *caça ao tesouro* e corresponde sobretudo a **US-04** e **US-05**, não à atual **US-02**.
- O antigo `US03` designava *assistente IA* e corresponde a **US-06**.
- O antigo `US04` designava o funcionamento offline e corresponde sobretudo a **US-02** e **RNF01**.
- As antigas `US05` (privacidade) e `US06` (gestão de salas) não correspondem às histórias atuais: privacidade passou a estar explicitada em **RNF03**, e gestão de salas permanece funcionalidade futura, com a exclusão de obras indisponíveis já abrangida por **US-01**.
- Os testes e implementações não foram alterados por esta revisão documental. A existência de testes verdes não demonstra automaticamente todos os critérios de aceitação da interface.
