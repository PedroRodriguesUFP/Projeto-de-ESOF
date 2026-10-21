# Requisitos prioritários — MNSR Digital

Este documento consolida os requisitos do projeto MNSR Digital, usando como referência as seis user stories registadas nas issues do GitHub (M1). Os identificadores `US-01` a `US-06` seguem o backlog original; os requisitos não funcionais mantêm a numeração `RNF01`–`RNF05`.

## Stakeholders

| Stakeholder | Papel / interesse no sistema | Requisitos relacionados |
| --- | --- | --- |
| **Visitante com tempo limitado / turista** | Pretende organizar uma visita de acordo com o tempo disponível e consultar informações das obras. | US-01, US-02, US-03 |
| **Visitante jovem / criança / família** | Procura uma visita interativa através de QR Codes, pistas e recompensas virtuais. | US-04, US-05 |
| **Visitante curioso** | Pretende esclarecer dúvidas sobre as obras com informação fiável. | US-06 |
| **Gestor / curador do museu (MNSR)** | Disponibiliza conteúdos sobre as obras e informa sobre obras indisponíveis, para manter as recomendações corretas. | US-01, US-03, US-06, RNF04 |
| **Equipa técnica / TI do museu** | Assegura desempenho, funcionamento offline, segurança e privacidade. | RNF01–RNF05 |

## Requisitos funcionais (user stories)

As user stories abaixo seguem a identificação e os critérios de aceitação das [issues do projeto](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues). As prioridades são propostas de planeamento e não substituem a priorização aprovada pela equipa.

| ID | User story | Epic | Prioridade proposta | Issue |
| --- | --- | --- | --- | --- |
| **US-01** | Como visitante com tempo limitado, quero escolher a duração da visita (30, 60 ou 90 min), para que a app me recomende as obras a ver sem ultrapassar o meu tempo. | EPIC-01 — Roteiros Inteligentes | Alta | [#5](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/5) |
| **US-02** | Como visitante nas galerias do piso -1 sem rede, quero aceder ao meu roteiro sem ligação, para que possa continuar a visita sem interrupções. | EPIC-01 — Roteiros Inteligentes | Alta | [#6](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/6) |
| **US-03** | Como visitante, quero ver a ficha completa da escultura O Desterro, para que compreenda a obra enquanto a observo. | EPIC-01 — Roteiros Inteligentes | Alta | [#7](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/7) |
| **US-04** | Como criança em visita, quero ler o QR Code junto a uma escultura, para que desbloqueie a próxima pista da caça ao tesouro. | EPIC-02 — Gamificação & QR Codes | Alta | [#8](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/8) |
| **US-05** | Como criança em visita, quero receber um prémio ao completar todas as pistas, para que me sinta motivada a terminar. | EPIC-02 — Gamificação & QR Codes | Média | [#9](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/9) |
| **US-06** | Como visitante curioso, quero fazer perguntas em linguagem natural sobre uma obra, para que obtenha respostas fiáveis sem procurar na internet. | EPIC-03 — Assistente IA / RAG | Média | [#10](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues/10) |

### Critérios de aceitação (resumo das issues)

| ID | Critérios de aceitação |
| --- | --- |
| **US-01** | Ao selecionar 30 minutos, o roteiro apresenta 5 a 7 obras e duração total até 30 minutos. Obras indisponíveis para restauro não são recomendadas; a duração do percurso permanece dentro do tempo escolhido. |
| **US-02** | Sem rede, um roteiro previamente gerado é carregado da cache local em menos de 1 segundo e surge o indicador «Modo Offline». Se não existir roteiro guardado, a app explica que é necessária uma ligação para gerar o primeiro. |
| **US-03** | A ficha de O Desterro apresenta autor, ano, material, texto explicativo, áudio e fotografias. Se o áudio não estiver disponível offline, os restantes conteúdos continuam acessíveis e surge um aviso adequado. |
| **US-04** | Um QR Code válido da caça desbloqueia a pista seguinte e atualiza o progresso. Um QR Code não reconhecido mostra uma mensagem de erro e não altera o progresso. |
| **US-05** | Após concluir todas as pistas, aparece uma recompensa virtual sem pedir dados pessoais. Quando faltam pistas, a recompensa permanece bloqueada e é indicado quantas faltam. |
| **US-06** | As respostas do assistente sobre obras baseiam-se apenas nos documentos do acervo do MNSR. Perguntas fora do domínio do museu são recusadas educadamente, com sugestões de perguntas relacionadas. |

## Requisitos não funcionais

Mantêm-se os identificadores e objetivos definidos no M2, corrigindo apenas as ligações às user stories. Estes requisitos deverão ser verificados através de testes e evidências apropriados nas fases seguintes.

| ID | Requisito | Atributo ISO 25010 | Requisitos relacionados |
| --- | --- | --- | --- |
| **RNF01** | A consulta de dados previamente guardados do roteiro e do progresso da caça ao tesouro deve funcionar sem rede; resposta local em menos de 1 segundo. | Fiabilidade / Eficiência de desempenho | US-02, US-04, US-05 |
| **RNF02** | O servidor deve suportar 300 utilizadores em simultâneo sem erros HTTP 5xx. | Eficiência de desempenho | Sistema em geral; a validar com testes de carga |
| **RNF03** | Nenhum dado pessoal é guardado sem consentimento; quando necessário, o progresso é associado a um identificador anónimo. | Segurança / Privacidade | US-04, US-05 |
| **RNF04** | O assistente de IA só responde com base em conteúdo curado do museu; a geração de roteiros não recomenda obras indisponíveis. | Correção funcional / Fiabilidade | US-06, US-01 |
| **RNF05** | Chaves de API e credenciais nunca são incluídas no repositório; utilizar configuração por variáveis de ambiente (`.env` e `.env.example`, sem segredos reais). | Segurança | Sistema em geral |

## Nota sobre o alinhamento documental

A numeração canónica das user stories é a das issues do GitHub (`US-01` a `US-06`). Os documentos de arquitetura e rastreabilidade foram alinhados com esta numeração. Os nomes dos ficheiros de código e os testes já existentes não foram modificados; os documentos indicam quando uma funcionalidade é apenas parcial ou planeada.

A gestão de salas e a afluência agregada, que apareciam na versão antiga como `US06`, são funcionalidades futuras fora das seis user stories originais. Não devem ser confundidas com `US-06` (assistente IA).
