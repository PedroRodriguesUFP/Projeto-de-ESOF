Grupo I: Conceitos diretos de requisitos e BDD

    Questão 1.1: RFs descrevem funcionalidades e RNFs descrevem atributos de qualidade.   
    RFs do e-mail: Criar um roteiro expresso de 30 minutos; Realizar uma Caça ao Tesouro com QR Codes nas salas.   
    RNFs do e-mail: A aplicação tem de funcionar perfeitamente offline nas galerias do piso -1; O sistema tem de estar em conformidade com o RGPD sem falhas.

    Questão 1.2: Os 3 Cs correspondem a Card (descrição inicial), Conversation (diálogo para eliminar ambiguidades) e Confirmation (critérios de aceitação testáveis). Um 'Card' não basta porque a equipa de engenharia precisa da 'Conversation' para clarificar os pedidos informais e ambíguos do cliente.

    Questão 1.3: O BDD utiliza a sintaxe Gherkin estruturada da seguinte forma: 'Dado' (Given) estabelece as condições iniciais e o estado atual; 'Quando' (When) descreve a ação desencadeadora; 'Então' (Then) define o resultado final esperado a ser verificado.

Grupo II: Questões de aplicação e modelação

    Questão 2.1: Para famílias com crianças, estudantes e turistas jovens que necessitam de uma experiência de visitação inovadora, a App MNSR Digital é uma aplicação móvel que disponibiliza roteiros expressos e caças ao tesouro interativas offline.

    Questão 2.2: Esta User Story viola o INVEST por não ser Independente, ditar especificações tecnológicas (MongoDB) e utilizar termos subjetivos não testáveis ("ser bonito").
        Correção: "Como utilizador jovem, quero visualizar imagens atrativas das esculturas para navegar facilmente pelas exposições do museu."

    Questão 2.3: O 'Espaço do Problema' aborda as necessidades de negócio, enquanto o 'Espaço da Solução' reflete a implementação técnica. Ocorreu contaminação quando o PO exigiu obrigatoriamente a utilização de "MongoDB para guardar tudo na nuvem". O risco é limitar a liberdade arquitetural da equipa de engenharia baseando-se num pedido precipitado.

Grupo III: Questões de elevada complexidade

    Questão 3.1: Para os três cenários em BDD:   
    (a) Happy Path: Dado que estou no ecrã inicial, Quando seleciono "Roteiro 30 minutos", Então o sistema gera um itinerário validado de meia hora.
    (b) Edge Case: Dado que o utilizador pede um roteiro, Quando insere "5 minutos", Então o sistema sugere ajustar para o tempo mínimo de 30 minutos.
    (c) Exceção: Dado que o roteiro é solicitado, Quando a estátua "O Desterro" está inacessível, Então o sistema alerta para a indisponibilidade e sugere uma obra alternativa.   

    Questão 3.2: Matriz conectando os elementos do piso -1:   
    [Necessidade: Explorar piso -1 sem rede] -> [Visão: App móvel offline] -> [User Story: Como visitante, quero usar a app nas galerias de pedra para não perder a interatividade] -> [Cenário BDD: Dado que não há Wi-Fi, Quando leio um QR Code, Então o prémio é registado localmente] -> [Teste Automatizado] -> [Atributo ISO 25010: Fiabilidade / Tolerância a falhas]. 

    Questão 3.3: O procedimento para o Marco M1 envolve: (1) Transformar a Visão do Produto e as User Stories (INVEST) em Issues; (2) Configurar devidamente as colunas no quadro Kanban; (3) Associar os respetivos testes BDD (Gherkin) às Issues correspondentes; e (4) Documentar de forma clara a utilização de ferramentas de IA Generativa para a formulação de critérios de aceitação no ficheiro docs/AI_LOG.md.