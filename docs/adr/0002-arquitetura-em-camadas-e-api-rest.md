# ADR-0002: Arquitetura em 3 camadas com serviços sobre interfaces e API REST

- **Estado:** Proposto
- **Data:** 2026-10-14

## Contexto
O projeto é incremental (M3 a M6) e exige testes automatizados, CI e refactoring. É preciso separar interface, regras de negócio (geração de roteiros, validação de QR, filtros de salas fechadas) e acesso a dados (cache local e API remota), e evitar "controllers gordos" e *bypass* de camada.

## Decisão
Adotar **3 camadas** — Apresentação, Serviço/Lógica de Negócio, Acesso a Dados — com a regra de dependências **unidirecional (cima → baixo)**. Os serviços dependem de **interfaces** (`ObraRepository`, `ProgressoRepository`, `AssistenteGateway`) injetadas por construtor. O servidor expõe uma **API REST** versionada (`/api/v1/...`) com JSON; segredos ficam em variáveis de ambiente.

## Alternativas consideradas
1. **Tudo num único módulo/script:** rápido de começar, mas inviabiliza testes e manutenção (risco já identificado no caso da startup das aulas).
2. **Microserviços:** excessivo para o tamanho do projeto e da equipa.

## Consequências
- (+) Serviços testáveis com *mocks* dos repositórios, sem rede nem base de dados.
- (+) Trocar a cache local ou a API remota não afeta as regras de negócio.
- (−) Mais ficheiros/interfaces do que o mínimo → aceitável pelo ganho em testabilidade.
- (−) Exige disciplina em *code review* para impedir que a UI chame repositórios diretamente.
