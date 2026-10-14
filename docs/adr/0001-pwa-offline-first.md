# ADR-0001: PWA com abordagem offline-first (cache local)

- **Estado:** Proposto
- **Data:** 2026-10-14

## Contexto
As galerias do piso -1 do museu não têm rede fiável. Os requisitos US04 e RNF01 exigem que roteiros e caça ao tesouro funcionem sem rede, com resposta em menos de 1 s. Um modelo que dependa exclusivamente de chamadas à API REST na nuvem falharia nesses espaços. Os visitantes também não devem ter de instalar uma app de loja.

## Decisão
Desenvolver uma **PWA** (Progressive Web App) com *Service Worker* para guardar a aplicação em cache e **IndexedDB** para guardar localmente o catálogo de obras/salas (snapshot) e o progresso da caça ao tesouro. O progresso é marcado como `sincronizado=false` e enviado à API quando a rede regressa.

## Alternativas consideradas
1. **App nativa (Android/iOS):** melhor acesso a hardware, mas exige instalação por loja, duas bases de código e mais esforço para uma equipa de 4 estudantes.
2. **Web app só online:** mais simples, mas viola US04/RNF01.

## Consequências
- (+) Funciona offline; sem instalação obrigatória; uma só base de código.
- (+) Resposta local rápida.
- (−) Dados podem ficar desatualizados (ex.: sala fechada para restauro) → o snapshot tem data/versão e é atualizado sempre que há rede.
- (−) Conflitos de sincronização → regra simples: o servidor aceita o progresso mais completo por identificador anónimo.
- (−) O assistente de IA não funciona offline → degradação controlada (ficha da obra em cache).
