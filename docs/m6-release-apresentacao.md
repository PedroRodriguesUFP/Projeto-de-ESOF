# Marco 6 (M6) — Release Candidate, Testes Finais e Guião de Demonstração

Este documento formaliza a entrega final do projeto integrado de Engenharia de Software (Semanas 12/13), incluindo as notas da *Release Candidate*, o resumo da bateria de testes nos três níveis (unitários, integração e sistema) e o guião de demonstração e defesa técnica.

---

## 1. Identificação da Release Candidate (CP6)

* **Versão Semântica (SemVer):** `v1.0.0-rc.1`
* **Estado do Pipeline CI/CD:** Passa sem erros (Testes Automatizados + Análise Estática + Auditoria de Segurança).
* **Comando de Execução Rápida (Demo CLI):** `node src/demo.js` (ou `npm run demo`)
* **Comando de Execução do Servidor Web:** `node server.js` (ou `npm start`)
* **Comando de Execução de Testes:** `npm test`

### Resumo das Funcionalidades Entregues (M0 a M6)
1. **Gestão de Obras, Salas e Roteiros de Museu (`RoteiroService`):** Criação e consulta de roteiros personalizados por tempo e interesse do visitante.
2. **Caça ao Tesouro Educativa (`CacaTesouroService`):** Validação de pistas, cálculo de pontuação e acompanhamento do estado de progresso do visitante (`ProgressoCaca`).
3. **Arquitetura Offline-First e Sincronização (`SincronizacaoService`):** Suporte a operação sem rede no museu e posterior sincronização resiliente com o servidor REST (`server.js`).
4. **Observabilidade, Qualidade e CI (`Logger.js`, `static-analysis.js`, `ci.yml`):** Registo estruturado de eventos, profiling de operações, verificação estática de código e integração contínua automatizada.

---

## 2. Estratégia e Evidência de Testes Finais (OA8)

Para cumprir o Objetivo de Aprendizagem OA8, a suite de testes foi estruturada em três níveis distintos na pasta `tests/`:

| Nível de Teste | Ficheiro(s) | Foco de Verificação |
| :--- | :--- | :--- |
| **Testes Unitários** | `tests/RoteiroService.test.js`<br>`tests/CacaTesouroService.test.js`<br>`tests/Logger.test.js` | Testam isoladamente a lógica de domínio, regras de negócio (pontuação, geração de roteiros, tratamento de erros em `erros.js`) e infraestrutura de logging/profiling. |
| **Testes de Integração** | `tests/Sincronizacao.integracao.test.js` | Testam a interação combinada entre o `SincronizacaoService`, o repositório de progresso (`ProgressoRepositoryMemoria`) e o registo de logs durante a resolução de conflitos offline/online. |
| **Testes de Sistema (E2E)** | `tests/Sistema.e2e.test.js` | Validam o sistema integrado de ponta a ponta: leitura do catálogo JSON (`data/catalogo-exemplo.json`), existência dos artefactos públicos (`public/index.html`), instanciação completa das camadas e execução integral do fluxo de demonstração (`src/demo.js`). |

---

## 3. Guião de Apresentação e Demonstração (10–15 min) (M6, OA10, OA12)

Este guião estrutura a demonstração prática e a defesa oral da equipa:

### Passo 1: Visão do Problema e Arquitetura (2 min)
* Explicar o problema: visitantes de museus (especialmente escolas e famílias) sofrem com falta de conectividade Wi-Fi/dados móveis em salas interiores e desinteresse em visitas estáticas.
* Mostrar as 2 decisões arquiteturais registadas em `docs/adr/`:
  * **ADR-0001:** Abordagem PWA Offline-First para funcionar sem rede.
  * **ADR-0002:** Arquitetura em Camadas (`dominio`, `servico`, `dados`, `infra`) exposta por API HTTP/REST.

### Passo 2: Demonstração ao Vivo da Aplicação (4 min)
1. **Fluxo de Linha de Comandos:** Executar `node src/demo.js` para demonstrar os casos de uso de negócio a correrem com logs estruturados.
2. **Fluxo Web / API REST:** Executar `node server.js`, abrir a interface em `public/index.html` no navegador e demonstrar:
   * Seleção de um roteiro temático.
   * Resolução de um desafio da Caça ao Tesouro.
   * Simulação de modo offline e sincronização do progresso com o servidor.

### Passo 3: Qualidade, Testes, CI e Uso Responsável de IA (3 min)
* Executar `npm test` e `node scripts/static-analysis.js` ao vivo para mostrar os testes unitários, de integração e de sistema a passar.
* Mostrar o histórico de commits, branches e o workflow `.github/workflows/ci.yml`.
* Apresentar o ficheiro `docs/AI_LOG.md`, destacando como a equipa validou criticamente e testou qualquer saída gerada por IA.

### Passo 4: Preparação para Perguntas da Defesa Oral Individual (OA12)
* **Como adicionar um novo requisito ou regra de pontuação?** Alterando apenas a classe `ProgressoCaca.js` ou `CacaTesouroService.js` na camada de domínio/serviço, sem ter de reescrever o repositório ou o frontend.
* **Como trocar a persistência em memória por uma Base de Dados SQL?** Criando uma nova implementação na camada `src/dados/` (ex.: `ObraRepositorySQL.js`) que respeite a mesma interface de `ObraRepositoryMemoria.js`.