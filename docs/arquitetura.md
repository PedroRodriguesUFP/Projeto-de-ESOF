# Arquitetura e modelação UML — App MNSR Digital (M2)

Os diagramas estão em **Mermaid** e renderizam nativamente no GitHub.
Rastreabilidade com requisitos: ver [`rastreabilidade.md`](rastreabilidade.md). Decisões: ver [`adr/`](adr/).

## 1. Modelo de casos de uso

O Mermaid não tem diagrama de casos de uso nativo; usa-se um fluxograma com a mesma semântica (atores à esquerda, casos de uso em elipses).

```mermaid
flowchart LR
    V([Visitante])
    G([Gestor do museu])
    IA([Serviço de IA externo])

    subgraph SIS["Sistema: App MNSR Digital"]
        UC1(("Gerar roteiro por tempo - US01"))
        UC2(("Ler QR Code de pista - US02"))
        UC3(("Consultar progresso e prémio - US02"))
        UC4(("Perguntar ao assistente - US03"))
        UC5(("Usar a app offline - US04"))
        UC6(("Consultar estado de salas - US06"))
        UC7(("Atualizar estado de sala ou obra - US06"))
        UC8(("Ver afluência agregada - US06"))
    end

    V --> UC1
    V --> UC2
    V --> UC3
    V --> UC4
    V --> UC5
    G --> UC6
    G --> UC7
    G --> UC8
    UC4 -.->|"usa"| IA
    UC1 -.->|"inclui"| UC6
    UC2 -.->|"estende com"| UC5
```

## 2. Diagrama de classes — modelo de domínio

```mermaid
classDiagram
    direction LR

    class Sala {
        -String id
        -String nome
        -int piso
        -EstadoSala estado
        +estaDisponivel() boolean
    }
    class Obra {
        -String id
        -String titulo
        -String autor
        -String descricao
        -int minutosVisitaEstimados
        +estaDisponivel() boolean
    }
    class Roteiro {
        -String id
        -int minutosDisponiveis
        +duracaoTotal() int
        +adicionarParagem(obra, minutos)
    }
    class ParagemRoteiro {
        -int ordem
        -int minutos
    }
    class CacaAoTesouro {
        -String id
        -String titulo
        +totalPistas() int
    }
    class PistaQR {
        -String codigo
        -String enigma
    }
    class ProgressoCaca {
        -int pistasConcluidas
        -boolean sincronizado
        +registarPista(codigo) boolean
        +estaCompleto() boolean
    }
    class Premio {
        -String descricao
    }
    class Visitante {
        -String idAnonimo
        -String idioma
    }
    class RespostaAssistente {
        -String texto
        -boolean geradaPorIA
        -List~String~ idsObrasCitadas
    }
    class EstadoSala {
        <<enumeration>>
        ABERTA
        FECHADA_RESTAURO
        FECHADA_EVENTO
    }

    Sala "1" --> "*" Obra : contem
    Sala --> EstadoSala
    Roteiro "1" *-- "1..*" ParagemRoteiro : composto por
    ParagemRoteiro "*" --> "1" Obra : refere
    CacaAoTesouro "1" *-- "*" PistaQR : composta por
    PistaQR "*" --> "1" Obra : localiza
    Visitante "1" --> "*" Roteiro : gera
    Visitante "1" --> "*" ProgressoCaca : tem
    ProgressoCaca "*" --> "1" CacaAoTesouro : de
    ProgressoCaca "1" --> "0..1" Premio : desbloqueia
    RespostaAssistente "*" ..> "*" Obra : cita
```

## 3. Arquitetura em camadas e regra de dependências

Três camadas; as dependências vão **apenas de cima para baixo**, e a camada de serviço depende de **interfaces** (inversão de dependências), o que permite testes unitários com *mocks* (ver ADR-0002).

```mermaid
flowchart TB
    subgraph APR["Camada de Apresentação (PWA)"]
        UI["Ecrãs: Roteiro, Caça ao Tesouro, Assistente, Gestor"]
        SW["Service Worker (cache da app)"]
    end
    subgraph SRV["Camada de Serviço / Lógica de Negócio"]
        RS["RoteiroService"]
        CS["CacaTesouroService"]
        AS["AssistenteService"]
        SS["SincronizacaoService"]
        GS["GestaoSalasService"]
    end
    subgraph DAD["Camada de Acesso a Dados"]
        OR["ObraRepository (interface)"]
        PR["ProgressoRepository (interface)"]
        LC["Implementação local: IndexedDB"]
        RA["Implementação remota: cliente da API REST"]
    end
    API[("API REST do servidor + base de dados")]
    LLM[("Serviço de IA externo")]

    UI --> RS
    UI --> CS
    UI --> AS
    UI --> GS
    RS --> OR
    CS --> OR
    CS --> PR
    SS --> PR
    SS --> OR
    GS --> OR
    AS --> OR
    OR --> LC
    OR --> RA
    PR --> LC
    PR --> RA
    RA --> API
    API --> LLM
```

### Classes de serviço e repositórios (desenho)

```mermaid
classDiagram
    class ObraRepository {
        <<interface>>
        +listarObrasDisponiveis() List~Obra~
        +obterPorId(id) Obra
        +obterPistaPorCodigo(codigo) PistaQR
        +guardarSnapshot(obras)
    }
    class ProgressoRepository {
        <<interface>>
        +obter(idAnonimo) ProgressoCaca
        +guardar(progresso)
        +listarPorSincronizar() List~ProgressoCaca~
    }
    class RoteiroService {
        -ObraRepository obras
        +gerarRoteiro(minutos) Roteiro
    }
    class CacaTesouroService {
        -ObraRepository obras
        -ProgressoRepository progresso
        +lerQR(codigo) ProgressoCaca
    }
    class AssistenteService {
        -ObraRepository obras
        -AssistenteGateway gateway
        +perguntar(texto) RespostaAssistente
    }
    class AssistenteGateway {
        <<interface>>
        +pedirResposta(texto, contexto) String
    }
    class SincronizacaoService {
        -ProgressoRepository progresso
        +sincronizar() int
    }
    class ObraLocalRepository
    class ObraRemoteRepository
    class ProgressoLocalRepository

    ObraRepository <|.. ObraLocalRepository
    ObraRepository <|.. ObraRemoteRepository
    ProgressoRepository <|.. ProgressoLocalRepository
    RoteiroService --> ObraRepository
    CacaTesouroService --> ObraRepository
    CacaTesouroService --> ProgressoRepository
    AssistenteService --> ObraRepository
    AssistenteService --> AssistenteGateway
    SincronizacaoService --> ProgressoRepository
```

## 4. Diagramas de sequência

### 4.1 Gerar roteiro de 30 minutos (US01, US04) — com e sem rede

```mermaid
sequenceDiagram
    actor V as Visitante
    participant UI as UI
    participant RS as RoteiroService
    participant OR as ObraRepository
    participant RA as API REST
    participant LC as Cache local

    V->>UI: Seleciona "Roteiro 30 minutos"
    UI->>RS: gerarRoteiro(30)
    RS->>OR: listarObrasDisponiveis()
    alt Existe rede
        OR->>RA: GET /api/v1/obras?disponiveis=true
        RA-->>OR: lista atualizada
        OR->>LC: guardarSnapshot(lista)
    else Sem rede (piso -1)
        OR->>LC: ler snapshot
        LC-->>OR: lista em cache
    end
    OR-->>RS: obras disponiveis
    RS->>RS: selecionar 5 a 7 obras que cabem em 30 min
    alt Tempo inferior a 30 min
        RS-->>UI: sugestao de ajustar para o minimo
    else Tempo valido
        RS-->>UI: Roteiro
    end
    UI-->>V: Mostra roteiro
```

### 4.2 Ler QR Code offline e sincronizar depois (US02, US04)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant UI as UI
    participant CS as CacaTesouroService
    participant OR as ObraRepository
    participant PR as ProgressoRepository
    participant SS as SincronizacaoService
    participant RA as API REST

    V->>UI: Le QR Code
    UI->>CS: lerQR(codigo)
    CS->>OR: obterPistaPorCodigo(codigo)
    OR-->>CS: PistaQR
    alt Codigo invalido
        CS-->>UI: erro "QR nao reconhecido"
    else Codigo valido
        CS->>PR: guardar(progresso atualizado, sincronizado=false)
        CS-->>UI: pista registada localmente
        UI-->>V: Feedback imediato (menos de 1 s)
    end
    Note over SS,RA: Mais tarde, quando a rede regressa
    SS->>PR: listarPorSincronizar()
    SS->>RA: POST /api/v1/progressos (id anonimo)
    RA-->>SS: 200 OK
    SS->>PR: marcar como sincronizado
```

### 4.3 Perguntar ao assistente de IA com validação (US03)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant UI as UI
    participant AS as AssistenteService
    participant OR as ObraRepository
    participant GW as AssistenteGateway
    participant LLM as Servico de IA

    V->>UI: Pergunta sobre uma obra
    UI->>AS: perguntar(texto)
    alt Sem rede
        AS-->>UI: "Assistente indisponivel offline" + ficha da obra em cache
    else Com rede
        AS->>OR: obter contexto curado da obra
        OR-->>AS: ficha da obra e estado da sala
        AS->>GW: pedirResposta(texto, contexto)
        GW->>LLM: pedido com contexto
        LLM-->>GW: texto gerado
        GW-->>AS: texto
        alt Resposta cita sala fechada ou obra desconhecida
            AS-->>UI: resposta rejeitada, mostra ficha curada
        else Resposta valida
            AS-->>UI: RespostaAssistente (geradaPorIA=true)
        end
    end
    UI-->>V: Mostra resposta com aviso "gerada por IA"
```

## 5. Estrutura de diretórios proposta

```text
Projeto-de-ESOF/
├── README.md
├── docs/
│   ├── AI_LOG.md
│   ├── EQUIPA.md
│   ├── requisitos.md
│   ├── arquitetura.md
│   ├── rastreabilidade.md
│   └── adr/
│       ├── 0001-pwa-offline-first.md
│       └── 0002-arquitetura-em-camadas-e-api-rest.md
├── src/
│   ├── apresentacao/   (UI + service worker)
│   ├── servico/        (RoteiroService, CacaTesouroService, ...)
│   ├── dados/          (repositórios locais e remotos)
│   └── dominio/        (Obra, Sala, Roteiro, ...)
├── tests/              (unitários, integração, sistema)
└── .env.example
```
