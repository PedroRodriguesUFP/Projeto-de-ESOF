# Requisitos prioritários (referência para o M2)

> **Nota:** as user stories do M1 (registadas no `AI_LOG.md` como tarefa M1.1) não estavam no repositório
> quando o M2 foi preparado. Esta lista é uma **reconstrução** a partir do problema, da visão do produto e do
> README. **Antes de entregar, alinhar os IDs e o texto com as issues/backlog reais do M1.**

## Requisitos funcionais (user stories)

| ID | User story | Prioridade |
| --- | --- | --- |
| US01 | Como visitante com pouco tempo, quero gerar um roteiro de 30 minutos com 5–7 obras, para aproveitar a visita sem me perder. | Alta |
| US02 | Como visitante jovem, quero fazer uma caça ao tesouro lendo QR Codes nas salas, para tornar a visita divertida. | Alta |
| US03 | Como visitante, quero perguntar a um assistente de IA sobre uma obra, para perceber o seu contexto. | Média |
| US04 | Como visitante nas galerias do piso -1, quero usar a app sem rede, para não perder interatividade. | Alta |
| US05 | Como visitante, quero que a app não exija dados pessoais para funcionar, para proteger a minha privacidade (RGPD). | Alta |
| US06 | Como gestor do museu, quero marcar salas/obras como indisponíveis (ex.: restauro) e ver a afluência agregada por sala, para gerir o fluxo. | Média |

## Requisitos não funcionais (quantificáveis)

| ID | Requisito | Atributo ISO 25010 |
| --- | --- | --- |
| RNF01 | Funcionalidades US01, US02 e US04 funcionam sem rede; resposta local em < 1 s. | Fiabilidade / Eficiência |
| RNF02 | O servidor suporta 300 utilizadores em simultâneo sem erros 5xx. | Eficiência de desempenho |
| RNF03 | Nenhum dado pessoal é guardado sem consentimento; o progresso é associado a um identificador anónimo. | Segurança / Privacidade |
| RNF04 | O assistente de IA só responde com base em conteúdo curado do museu e nunca recomenda salas indisponíveis. | Fiabilidade / Correção funcional |
| RNF05 | Segredos (chaves de API, credenciais) nunca entram no repositório (`.env` + `.env.example`). | Segurança |
