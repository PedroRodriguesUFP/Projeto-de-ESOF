Grupo I: Questões de conceitos diretos~

    Questão 1.1: O modelo tradicional Waterfall caracteriza-se por uma abordagem preditiva,
    de planeamento rígido e com entregas no final do ciclo, ao passo que o modelo Ágil (Scrum)
    é focado em adaptação contínua e entregas de incrementos funcionais iterativos. O Product Owner
    falhou ao alterar as prioridades e adicionar novos requisitos a meio da Sprint, desrespeitando o planeamento
    e o foco estabelecidos sem consultar a equipa.

    Questão 1.2: A estrutura básica do Scrum engloba 3 Papéis (Product Owner, Scrum Master, Developers),
    3 Artefactos principais (Product Backlog, Sprint Backlog, Incremento) e 4 Rituais chave (Sprint Planning, 
    Daily Stand-up, Sprint Review, Sprint Retrospective).

    Questão 1.3: O GitHub Flow é um ciclo composto pela criação de branches a partir da principal, realização de commits, abertura de uma Pull Request, revisão do código e, finalmente, o merge. Comitar diretamente na branch main é uma má prática porque compromete a estabilidade do software e impossibilita a revisão por pares (peer review). A Pull Request é o mecanismo do GitHub recomendado para integrar o código de forma segura.

Grupo II: Questões de complexidade média

    Questão 2.1: A estimativa baseada em "horas absolutas" falhou porque a equipa subestimou o planeamento ao ignorar fatores como a complexidade de integração dos QR Codes. A estimativa relativa recorre a Story Points (baseados na Sequência de Fibonacci modificada: 1, 2, 3, 5, 8, 13) e à técnica de Planning Poker, que incentiva a equipa a discutir colaborativamente e a avaliar as User Stories pela sua complexidade intrínseca em vez de horas cronológicas.

    Questão 2.2: Os Commits Convencionais forçam a utilização da sintaxe estruturada <tipo>(<âmbito>): <descrição>. Três exemplos aplicáveis ao projeto são: feat(roteiro): adiciona gerador de roteiros de 30 min, fix(ui): corrige interface de leitura de QR Codes e docs(readme): atualiza instrucoes de acesso. Para vincular um commit ao fecho automático de uma Issue, deve-se adicionar no texto a expressão Closes #numero_da_issue.

    Questão 2.3: A etiqueta <<<<<<< HEAD assinala o bloco de código presente na branch local do programador, o ======= atua como divisor entre as duas versões de código, e o >>>>>>> feature/us02-filtro-galeria indica a secção de código recebida da branch que se tenta integrar. O programador deve apagar as marcas do Git no ficheiro, ajustar e manter o código correto, e de seguida utilizar os comandos git add e git commit no terminal para resolver o conflito sem forçar o processo.

Grupo III: Questões de elevada complexidade

    Questão 3.1: O quadro GitHub Projects deve possuir colunas que reflitam o fluxo de trabalho e delimitar rigidamente o limite de tarefas em simultâneo através do Work In Progress (WIP). A Definition of Done (DoD) tem de estabelecer 5 critérios objetivos necessários para que uma funcionalidade seja dada como concluída. O Scrum Master deve intervir para bloquear o pedido do PO de introduzir a bilheteira a meio da Sprint 1, canalizando essa funcionalidade para o Product Backlog a fim de ser contemplada em Sprints futuras.

    Questão 3.2: O protocolo de Peer Review deve abranger 4 dimensões obrigatórias: Conformidade BDD, Qualidade de Código, Cobertura de Testes e Segurança/AI_LOG. As Branch Protection Rules exigidas para a branch main devem impor a revisão de Pull Requests e impedir a aprovação com revisões superficiais (como "LGTM").

    Questão 3.3: O estudante deve correr, por ordem: git status para confirmar as alterações; git fetch origin seguido de git merge origin/main (ou apenas git pull origin main) para integrar a versão remota; após resolver conflitos nos ficheiros manualmente, deve correr git add ., seguido de git commit -m "Resolve merge com a main" e finalizar com git push origin feature/us01-roteiro.