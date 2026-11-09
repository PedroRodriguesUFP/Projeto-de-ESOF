Grupo I: Questões de conceitos

    Questão 1.1: A arquitetura em 3 camadas divide-se em Apresentação, Lógica de Negócio/Serviço e Acesso a Dados/Repositório. A Regra das Dependências estipula que a interação entre camadas é unidirecional de cima para baixo; a camada de Acesso a Dados não pode invocar as camadas superiores para assegurar a modularidade e o isolamento das regras do sistema.

    Questão 1.2: Um Diagrama de Classes documenta a estrutura estática do sistema ao representar as diferentes entidades, os seus atributos e as respetivas relações. Por sua vez, o Diagrama de Sequência mapeia o comportamento dinâmico através do fluxo temporal das interações e chamadas de métodos entre componentes durante uma execução.

    Questão 1.3: Um ADR atua como documento formal para manter a memória do projeto e justificar decisões de arquitetura, sendo vital no controlo da dívida técnica. As 5 secções estandardizadas são: Título, Contexto, Decisão, Consequências e Estado/Data.

Grupo II: Questões de complexidade média

    Questão 2.1: O código app_mnsr.py requer uma divisão profunda: a classe ObraRepository assume toda a ligação à base de dados (sqlite3.connect) e execução da querie SELECT; a classe RoteiroService encapsula exclusivamente a lógica e os cálculos iterativos das margens de tempo (tempo_total + o[2] <= tempo_disp); e a classe RoteiroCLI ficará encarregue unicamente do input e print.

    Questão 2.2: O código requer um bloco classDiagram contendo definições para as classes 'ObraDeArte', 'Exposicao', 'Roteiro' e 'Visitante'. Deve explicitar atributos utilizando hifens (-) para as variáveis privadas e sinais de mais (+) para métodos públicos, bem como representar graficamente as setas de multiplicidade e associação (1, *) entre os componentes arquiteturais definidos.

    Questão 2.3: O texto formal do ADR deve declarar o contexto da indisponibilidade de internet no piso -1, justificando a adoção do SQLite ou de um cache de dispositivo local, e explicitar as vantagens desta escolha em relação ao modelo original que estaria refém de chamadas exclusivas à API REST na nuvem.

Grupo III: Questões de elevada complexidade

    Questão 3.1: A notação em Mermaid.js utilizará o elemento sequenceDiagram interligando os nós correspondentes à 'UI', 'RoteiroService', 'RemoteAPI' e 'LocalCache Repository'. Utiliza-se um bloco alt para ilustrar o sucesso da comunicação com a 'RemoteAPI' e a instrução else para detalhar a ativação secundária do 'LocalCache Repository' devido a falhas na rede.

    Questão 3.2: Um "Controller Gordo" centraliza lógica excessiva, e o "Bypass de Camada" dá-se quando um elemento da interface invoca a persistência diretamente. Ao recorrer à Injeção de Dependências e à Inversão de Controlo, passa-se as referências dos componentes através de construtores, diminuindo o acoplamento, o que permite criar testes pytest que instanciam um "Mock" do Repositório para testar exclusivamente a eficácia da lógica do negócio do Serviço.

    Questão 3.3: O Marco M2 exige uma organização estrita da árvore de diretórios, conectando de forma rastreável as User Stories BDD elaboradas no Marco M1 às abstrações representadas na Arquitetura em 3 Camadas. Para apresentar a modelação UML, deve-se embeber o código Mermaid no ficheiro README.md através de blocos de código markdown definidos com a linguagem "mermaid" para a sua renderização nativa.