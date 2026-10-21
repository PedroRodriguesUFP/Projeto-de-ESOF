# ADR-0001: PWA com abordagem offline-first (cache local)

- **Estado:** Proposto (implementação parcial do núcleo; PWA ainda por implementar)
- **Data da proposta:** 2026-10-14
- **Atualização documental:** 2026-10-21

## Contexto

As galerias do piso -1 do museu podem apresentar rede pouco fiável. A **US-02** (issue #6) exige consultar um roteiro previamente gerado sem ligação e o **RNF01** define resposta local inferior a 1 segundo. A **US-04** (issue #8) e a **US-05** (issue #9) beneficiam de registo e consulta local do progresso da caça ao tesouro. Uma aplicação dependente apenas de chamadas à API na nuvem falharia nestas situações.

## Decisão proposta

Desenvolver uma **PWA** (*Progressive Web App*) com **Service Worker** para disponibilizar os recursos da aplicação em cache e **IndexedDB** para guardar localmente os roteiros, um catálogo/snapshot de obras e o progresso da caça ao tesouro. Operações pendentes de sincronização são marcadas com `sincronizado=false` e enviadas à API quando a rede regressar.

Esta é uma decisão arquitetural; **não significa que IndexedDB, Service Worker ou API REST já estejam implementados**. No M3/M4 existem serviços e repositórios em memória para demonstrar regras de negócio e sincronização.

## Alternativas consideradas

1. **Aplicação nativa Android/iOS:** pode oferecer integração com hardware, mas implica mais esforço de desenvolvimento e distribuição.
2. **Aplicação web apenas online:** tem menor complexidade inicial, mas não satisfaz os cenários offline da US-02 e RNF01.

## Consequências e riscos

- (+) Uma base de código web e continuidade da visita quando a rede falha, após os dados necessários terem sido previamente guardados.
- (+) Possibilidade de resposta local rápida (ainda carece de validação end-to-end).
- (−) Os dados em cache podem ficar desatualizados, por exemplo quando uma sala encerra; prever versão/data de atualização do catálogo.
- (−) A sincronização precisa de regras para duplicações e conflitos; hipótese inicial: conservar o progresso válido mais completo por identificador anónimo.
- (−) O assistente de IA da **US-06** (issue #10) poderá não funcionar offline; alternativa proposta: apresentar a ficha de obra previamente guardada.

## Verificações pendentes

- Testar carregamento de um roteiro pré-gerado sem rede em menos de 1 segundo (**US-02/RNF01**).
- Confirmar o comportamento quando o visitante não possui roteiro em cache.
- Validar sincronização após perda/restabelecimento de ligação, incluindo situações de conflito.
- Verificar privacidade dos dados guardados localmente (**RNF03**).
