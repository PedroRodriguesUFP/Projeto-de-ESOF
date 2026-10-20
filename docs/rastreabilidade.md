# Matriz de rastreabilidade (M2)

Necessidade → Requisito → Elementos de desenho → Teste previsto (M3) → Atributo de qualidade.

| Requisito | Classes de domínio | Serviço / camada | Diagrama | Teste previsto (M3) | Atributo |
| --- | --- | --- | --- | --- | --- |
| US01 Roteiro por tempo | Roteiro, ParagemRoteiro, Obra | RoteiroService → ObraRepository | 4.1 | Unitário: roteiro de 30 min tem 5–7 obras e duração ≤ 30; 5 min sugere ajuste | Correção funcional |
| US02 Caça ao tesouro | CacaAoTesouro, PistaQR, ProgressoCaca, Premio | CacaTesouroService → ProgressoRepository | 4.2 | Unitário: QR válido regista pista; QR inválido devolve erro; completo desbloqueia prémio | Correção funcional |
| US03 Assistente IA | RespostaAssistente, Obra | AssistenteService → AssistenteGateway | 4.3 | Unitário com mock do gateway: resposta com sala fechada é rejeitada | Fiabilidade |
| US04 Offline | Obra, ProgressoCaca | ObraLocalRepository, SincronizacaoService | 4.1, 4.2 | Integração: sem rede, ler QR grava localmente em < 1 s; sincroniza ao voltar a rede | Fiabilidade / Tolerância a falhas |
| US05 RGPD | Visitante (idAnonimo) | ProgressoRepository | 2, 3 | Unitário: nenhum campo pessoal persistido sem consentimento | Segurança / Privacidade |
| US06 Gestão de salas | Sala, EstadoSala | GestaoSalasService | 1, 3 | Unitário: sala FECHADA_RESTAURO nunca entra num roteiro | Correção funcional |
| RNF02 300 utilizadores | — | API REST | 3 | Teste de carga básico (M4/M5) | Eficiência |
| RNF05 Segredos | — | Configuração | — | CI: verificação de segredos (M4) | Segurança |
