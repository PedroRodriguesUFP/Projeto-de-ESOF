Grupo I: Questões de conceitos

    Questão 1.1: A programação foca-se na simples escrita de código, enquanto a Engenharia de Software requer processos estruturados, testes e manutenção contínua. A startup demonstrou esta confusão ao gerar um script único de 1.800 linhas em 48 horas, considerando o projeto concluído apenas com base em testes individuais e sem aplicar controlo de versões ou testes automatizados.

    Questão 1.2: As quatro propriedades inerentes à dificuldade do software são a Complexidade, a Conformidade, a Mutabilidade e a Invisibilidade. A invisibilidade reflete-se na ausência de rastreabilidade e testes estruturados no código; a complexidade é demonstrada pela falha no desempenho quando a base de dados colapsou devido a 300 conexões simultâneas não geridas.

    Questão 1.3: Eficiência de Desempenho (violada quando o sistema bloqueou com tempos de espera superiores a 45 segundos e erros 500), Segurança (chaves de API e credenciais da base de dados publicadas em texto limpo num repositório público) e Manutenibilidade (ausência de testes unitários que permitiu alterações acidentais em lógicas de negócio).

Grupo II: Questões de complexidade média

    Questão 2.1: A "Crise do Software" original caracterizava-se por projetos que ultrapassavam orçamentos e entregavam produtos não confiáveis. A "Nova Crise" aplicada ao MNSR demonstra que o uso desregrado de IA permite gerar código muito rapidamente, mas resulta num sistema igualmente não confiável, com colapso de infraestruturas, vulnerabilidades de segurança severas e alucinações de dados.

    Questão 2.2: O modelo de IA recomendou a visita a uma sala temporariamente fechada para restauro porque gerou informações plausíveis mas desatualizadas sem que houvesse qualquer validação por um utilizador humano (human-in-the-loop). A equipa deveria ter utilizado a ferramenta AI_LOG.md para auditar e justificar o uso da IA. 

    Questão 2.3: Requisitos Funcionais (RF) definem o que o sistema faz, enquanto Requisitos Não Funcionais (RNF) definem os atributos de qualidade.   
    RFs: O sistema deve permitir a reserva de bilhetes com desconto jovem; O sistema deve gerar roteiros de visitação de 30 minutos.   
    RNFs quantificáveis: O sistema tem de suportar 300 acessos em simultâneo; O tempo de resposta não pode exceder os 45 segundos sob carga.

Grupo III: Questões de elevada complexidade

    Questão 3.1: O plano deve promover a transição de um "script casual efémero" para um "produto de engenharia sustentável". Este plano deve englobar a reestruturação da arquitetura em camadas (separando interface de acesso a dados), a implementação de controlo de versões estruturado por branches e uma estratégia de validação assente em testes unitários automatizados.

    Questão 3.2: A aceitação sem auditoria de código gerado por IA introduz vulnerabilidades e erros lógicos, acelerando a "podridão do software" (Software Decay). É essencial instituir um protocolo de Quality Gate no repositório de grupo para rever e mitigar a Dívida Técnica originada por este processo.

    Questão 3.3: O projeto deve utilizar um repositório GitHub nomeado esof-2026-grupoXX. O ficheiro .gitignore evita o envio de ficheiros locais para o servidor, o .env.example previne a exposição de credenciais (mitigando as falhas de segurança observadas), o README.md documenta o projeto, e o diretório docs/AI_LOG.md é utilizado para governar a utilização de IA.