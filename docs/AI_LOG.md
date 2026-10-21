# Registo de Proveniência e Uso de IA Generativa (AI Log)

**Projeto:** App MNSR Digital | **Equipa:** 01

Este registo documenta a utilização declarada de IA no projeto. A revisão e validação final devem ser confirmadas pelos estudantes antes da entrega.

| Data | ID Tarefa | Ferramenta GenAI | Tarefa / finalidade | Output gerado ou sugerido | Validação humana / limitações | Risco |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-13 | M0.1 | Claude | Estrutura do README e AI_LOG para o M0 | Texto base do README e modelo do log | Registo histórico: revisto por Pedro e adaptado aos dados da equipa. | Baixo |
| 2026-10-13 | M1.1 | Claude | Converter requisitos do MNSR em user stories BDD | Seis histórias com cenários *Given–When–Then* | Registo histórico: ajustados tempos de visita (30 min, 5–7 obras), offline e RGPD. | Médio |
| 2026-10-14 | M2.1 | Claude | Elaborar modelos UML, arquitetura em camadas, ADRs e rastreabilidade | Rascunhos de `arquitetura.md`, `requisitos.md`, `rastreabilidade.md` e ADR-0001/0002 | Registo histórico: diagramas revistos; foi detetada reconstrução de IDs divergente das issues originais, posteriormente corrigida na revisão DOC. | Médio |
| 2026-10-18 | M3.1 | Claude / Gemini | Apoio ao incremento de domínio, serviços e testes | Código em `src/`, catálogo de exemplo, 17 testes documentados no M3 e guia `m3-incremento.md` | Registo histórico: testes e demo indicados como validados localmente; a revisão posterior conservou os 17 como marco histórico. | Médio |
| 2026-10-20 | M4.1 | Gemini | Apoio à CI, análise estática e logging | Workflow GitHub Actions, verificador estático, Logger, 3 testes adicionais e guia M4 | Registo histórico: 20 testes reportados como aprovados. CI verificada em 21-10-2026, sem inferir conclusão de toda a PWA. | Médio |
| 2026-10-21 | DOC.1 | ChatGPT (OpenAI, GPT-6) | Alinhar documentação M1–M4 com issues reais do GitHub e corrigir inconsistências de rastreabilidade | Revisões de `requisitos.md`, `rastreabilidade.md`, `arquitetura.md` e `README.md`; revisão de `m3-incremento.md` e proposta de atualização de `m4-ci-qualidade.md` e ADR-0001 | **A confirmar pela equipa:** comparar IDs com issues #5–#10, rever diagramas Mermaid, testar links e verificar ficheiros alterados com `git diff`. IA não executou os testes locais nem aprovou a revisão humana em nome dos estudantes. | Médio |
| 2026-10-21 | DOC.2 | ChatGPT (OpenAI, GPT-6) | Tornar o registo de IA completo e rastreável | Proposta de revisão deste `AI_LOG.md` sem eliminar o histórico | **A confirmar:** validar a fidelidade dos registos históricos e aceitar/corrigir descrições antes do commit. | Baixo |

## Verificações recomendadas antes da entrega

- Confirmar que as seis histórias do backlog usam `US-01` a `US-06` em toda a documentação atual.
- Consultar os critérios originais nas [issues do GitHub](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues).
- Executar `npm run lint`, `npm test`, `npm run test:ci` e `npm run demo` localmente, registando os resultados reais.
- Verificar os diagramas Mermaid e comparar o conteúdo dos ficheiros alterados com `git diff`.
- Substituir as indicações «a confirmar» por evidências concretas **apenas após a validação humana efetiva**.

Não é necessário arquivar a conversa integral com a IA. Os registos devem permitir identificar ferramenta, tarefa, objetivo, resultado, decisão humana e limitações.
