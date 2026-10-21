# Arquitetura e modelação UML — App MNSR Digital (M2)

Documento atualizado para usar os identificadores das [issues originais](https://github.com/PedroRodriguesUFP/Projeto-de-ESOF/issues): **US-01** roteiro, **US-02** roteiro offline, **US-03** ficha da obra, **US-04** leitura QR, **US-05** recompensa e **US-06** assistente IA. A arquitetura PWA/REST/IndexedDB é **proposta**; o repositório contém sobretudo lógica de domínio, serviços e repositórios em memória. Ver [requisitos](requisitos.md), [rastreabilidade](rastreabilidade.md) e [decisões ADR](adr/).

## 1. Modelo de casos de uso

O Mermaid não tem um diagrama UML de casos de uso nativo; este fluxograma representa atores e funcionalidades, sem pretender substituir integralmente a notação UML.

```mermaid
flowchart LR
    V([Visitante])
    C([Criança / família])
    IA([Serviço de IA externo])
    subgraph APP["Sistema MNSR Digital — funcionalidades previstas"]
        UC1(("Gerar roteiro por tempo — US-01"))
        UC2(("Consultar roteiro offline — US-02"))
        UC3(("Consultar ficha de O Desterro — US-03"))
        UC4(("Ler QR e desbloquear pista — US-04"))
        UC5(("Receber prémio — US-05"))
        UC6(("Perguntar sobre uma obra — US-06"))
    end
    V --> UC1
    V --> UC2
    V --> UC3
    V --> UC6
    C --> UC4
    C --> UC5
    UC6 -.-> IA
```

O gestor/curador do museu é um stakeholder importante para conteúdos e disponibilidade das obras, mas a gestão de salas e estatísticas de afluência são **ideias futuras**, não a `US-06` do backlog.

## 2. Diagrama de classes — modelo de domínio (visão conceptual)

Inclui entidades previstas no desenho; nem todas correspondem a classes já implementadas.

```mermaid
classDiagram
    class Sala {
        +id
        +nome
        +estado
        +estaDisponivel() boolean
    }
    class Obra {
        +id
        +titulo
        +autor
        +descricao
        +minutosVisitaEstimados
        +estaDisponivel() boolean
    }
    class Roteiro {
        +id
        +minutosDisponiveis
        +duracaoTotal() int
    }
    class PistaQR {
        +codigo
        +enigma
    }
    class ProgressoCaca {
        +pistasConcluidas
        +sincronizado
        +registarPista(codigo) boolean
        +estaCompleto() boolean
    }
    class Premio {
        +descricao
    }
    class Visitante {
        +idAnonimo
    }
    class RespostaAssistente {
        +texto
        +geradaPorIA
        +idsObrasCitadas
    }
    Sala "1" --> "*" Obra : contém
    Roteiro "1" --> "1..*" Obra : inclui
    PistaQR "*" --> "1" Obra : identifica
    Visitante "1" --> "*" ProgressoCaca : possui
    ProgressoCaca "1" --> "0..1" Premio : desbloqueia
    RespostaAssistente "*" ..> "*" Obra : referencia
```

A ficha completa de **US-03** depende de dados curados (autor, ano, material, texto, áudio e fotografias), alguns ainda não representados no modelo de exemplo. O assistente de **US-06** é ainda uma proposta.

## 3. Arquitetura em camadas

```mermaid
flowchart TB
    subgraph PRE["Apresentação — PWA planeada"]
        UI["Ecrãs: Roteiros, Ficha de Obra, QR, Recompensa, Assistente"]
        SW["Service Worker — por implementar"]
    end
    subgraph SER["Serviço / negócio"]
        RS["RoteiroService — existente"]
        CS["CacaTesouroService — existente"]
        SS["SincronizacaoService — existente"]
        AS["AssistenteService — previsto"]
    end
    subgraph DAD["Acesso a dados"]
        MEM["Repositórios em memória — existentes"]
        IDX["IndexedDB — previsto"]
        REM["Cliente API REST — previsto"]
    end
    API["API REST / base de dados — previstas"]
    LLM["Serviço IA — previsto"]
    UI --> RS
    UI --> CS
    UI --> AS
    RS --> MEM
    CS --> MEM
    SS --> MEM
    MEM -.-> IDX
    MEM -.-> REM
    REM -.-> API
    AS -.-> LLM
    SW -.-> IDX
```

A separação de camadas e as escolhas previstas são justificadas nos ADRs. A execução atual permite `npm run demo`, sem interface gráfica. A presença de um esquema no diagrama **não comprova a implementação** dos seus componentes.

### Serviços e repositórios (estado resumido)

| Componente | Estado em `master` | Papel |
| --- | --- | --- |
| `RoteiroService` | Implementado | Lógica de seleção por tempo e exclusão de obras indisponíveis (US-01) |
| `CacaTesouroService` e `ProgressoCaca` | Implementados | Regras de pistas e prémio (US-04/US-05) |
| `SincronizacaoService` | Implementado | Lógica de sincronização, testada em memória (apoio a US-02) |
| `ObraRepositoryMemoria` / `ProgressoRepositoryMemoria` | Implementados | Dados locais voláteis |
| `AssistenteService` / gateway IA | Planeados | Perguntas fundamentadas no acervo (US-06) |
| `IndexedDB`, `Service Worker` e API REST | Planeados | Persistência offline e serviços remotos |

## 4. Diagramas de sequência — fluxos previstos

### 4.1 Roteiro e consulta offline (US-01 / US-02)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant UI as Interface (prevista)
    participant RS as RoteiroService
    participant OR as Repositório de obras
    participant LC as Cache persistente (prevista)
    V->>UI: Escolhe 30 min
    UI->>RS: gerarRoteiro(30)
    RS->>OR: listar obras disponíveis
    OR-->>RS: Obras válidas
    RS-->>UI: Roteiro de 5–7 obras (até 30 min)
    UI-->>V: Apresenta roteiro
    opt Roteiro guardado previamente
        UI->>LC: Guardar roteiro
        Note over V,LC: Mais tarde, sem ligação à rede (US-02)
        V->>UI: Consultar roteiro
        UI->>LC: Ler roteiro guardado
        LC-->>UI: Conteúdo local
        UI-->>V: Roteiro + indicação Modo Offline
    end
```

O primeiro fluxo tem lógica no `RoteiroService`; a interface e a cache persistente pertencem ao desenvolvimento futuro.

### 4.2 QR e recompensa (US-04 / US-05)

```mermaid
sequenceDiagram
    actor C as Criança
    participant UI as Leitor QR (previsto)
    participant CS as CacaTesouroService
    participant OR as Repositório de obras
    participant PR as Repositório de progresso
    C->>UI: Lê QR Code
    UI->>CS: lerQR(codigo)
    CS->>OR: obter pista por código
    alt QR não reconhecido
        OR-->>CS: Não encontrado
        CS-->>UI: Erro, progresso inalterado
    else QR válido
        OR-->>CS: Pista válida
        CS->>PR: Guardar progresso
        alt Todas as pistas concluídas
            CS-->>UI: Recompensa virtual desbloqueada
        else Faltam pistas
            CS-->>UI: Progresso atualizado
        end
    end
    UI-->>C: Mostra resultado
```

A validação e o progresso existem na lógica de negócio; a leitura de QR pela câmara e o ecrã de recompensa ainda não existem.

### 4.3 Assistente IA com contexto curado (US-06 — previsto)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant UI as Interface (prevista)
    participant AS as AssistenteService (previsto)
    participant AC as Documentação curada
    participant IA as Serviço IA (previsto)
    V->>UI: Pergunta sobre uma obra
    UI->>AS: perguntar(texto)
    AS->>AC: Obter informação do acervo
    alt Pergunta fora do domínio
        AS-->>UI: Recusa educada e sugestões sobre obras
    else Pergunta sobre obra
        AC-->>AS: Conteúdo verificado
        AS->>IA: Pedido limitado ao contexto
        IA-->>AS: Resposta candidata
        AS-->>UI: Resposta fundamentada ou aviso de insuficiência
    end
    UI-->>V: Mostra resposta
```

Não existe implementação nem teste do assistente IA no núcleo atual. O requisito exige respostas baseadas em documentos do acervo; não se assume que a simples chamada a um LLM garanta essa condição.

## 5. Estrutura existente e componentes futuros

```text
Projeto-de-ESOF/
├── README.md
├── docs/
│   ├── requisitos.md
│   ├── rastreabilidade.md
│   ├── arquitetura.md
│   ├── m3-incremento.md
│   ├── m4-ci-qualidade.md
│   ├── AI_LOG.md
│   └── adr/
├── data/catalogo-exemplo.json
├── src/
│   ├── dominio/       (existente)
│   ├── dados/         (repositórios em memória existentes)
│   ├── servico/       (serviços existentes)
│   └── infra/         (Logger existente)
├── tests/              (testes de unidade e integração)
├── scripts/            (análise estática)
└── .github/workflows/  (CI)
```

**Por desenvolver:** interface PWA, IndexedDB, Service Worker, integração REST e assistente IA. **Por validar:** critérios de aceitação de ponta a ponta, conteúdo real do MNSR e requisitos de desempenho/privacidade da aplicação final.
