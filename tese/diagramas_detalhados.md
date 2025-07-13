# Diagramas Detalhados - Complementares

## Arquitetura de Componentes Angular

```mermaid
graph TB
    subgraph "App Module"
        APP[AppComponent]
        ROUTING[AppRoutingModule]
    end

    subgraph "Pages"
        LANDING[LandingComponent]
        HOME[HomeComponent]
        ALBUM[AlbumComponent]
        PROFILE[WriterProfileComponent]
        TUTORIAL[TutorialComponent]
    end

    subgraph "Home Components"
        MAP[MapComponent]
        STATUES[StatuesComponent]
    end

    subgraph "Shared Components"
        HEADER[HeaderComponent]
        SIDEMENU[SideMenuComponent]
        STATUECARD[StatueCardComponent]
        COINICON[CoinIconComponent]
        SCOREBAR[ScoreBarComponent]
    end

    subgraph "AR Module"
        ARMAIN[AugmentedRealityComponent]
        ARDETECT[ArImgDetectComponent]
    end

    subgraph "Services"
        SCORE[ScoreService]
        STATUESSVC[StatuesService]
        AUDIO[AudioService]
        NAVTRACK[NavigationTrackerService]
    end

    APP --> LANDING
    APP --> HOME
    APP --> ALBUM
    APP --> PROFILE
    APP --> TUTORIAL
    APP --> ARMAIN

    HOME --> MAP
    HOME --> STATUES

    HOME --> HEADER
    HOME --> SIDEMENU
    HOME --> STATUECARD

    ARMAIN --> ARDETECT

    HOME --> SCORE
    HOME --> STATUESSVC
    ARDETECT --> AUDIO
    ARDETECT --> SCORE
```

## Fluxo de Dados e Estado

```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> Tutorial: Primeiro acesso
    Landing --> Home: Usuário existente

    Tutorial --> Home: Concluir tutorial

    state Home {
        [*] --> MapaVisível
        MapaVisível --> EstatuaSelecionada: Clicar no marcador
        EstatuaSelecionada --> PerfilEscritor: Ver detalhes
        PerfilEscritor --> AR: Ativar experiência
        AR --> MapaVisível: Voltar ao mapa

        MapaVisível --> Album: Ver progresso
        Album --> MapaVisível: Voltar ao mapa
    }

    Home --> [*]: Sair da aplicação
```

## Pipeline de Deploy e CI/CD

```mermaid
graph LR
    subgraph "Desenvolvimento"
        DEV[Desenvolvedor]
        GIT[GitHub Repository]
        BRANCH[Branch Main]
    end

    subgraph "Build & Test"
        BUILD[Angular Build]
        TEST[Testes Automatizados]
        OPTIMIZE[Otimização Assets]
    end

    subgraph "Deploy"
        HEROKU[Heroku Platform]
        CF[Cloudflare CDN]
        DNS[GoDaddy DNS]
    end

    subgraph "Monitoramento"
        LOGS[Logs de Acesso]
        METRICS[Métricas de Performance]
        ERRORS[Monitoramento de Erros]
    end

    DEV --> GIT
    GIT --> BRANCH
    BRANCH --> BUILD
    BUILD --> TEST
    TEST --> OPTIMIZE
    OPTIMIZE --> HEROKU
    HEROKU --> CF
    CF --> DNS
    HEROKU --> LOGS
    CF --> METRICS
    HEROKU --> ERRORS
```

## Estratégias de Otimização

```mermaid
graph TD
    subgraph "Carregamento"
        LAZY[Lazy Loading<br/>Módulos Angular]
        CHUNK[Code Splitting<br/>Webpack]
        PRELOAD[Preload Assets<br/>Críticos]
    end

    subgraph "Assets 3D"
        GLTF[glTF Format<br/>Leve e Eficiente]
        DRACO[Draco Compression<br/>90% Redução]
        LOD[Level of Detail<br/>Adaptativo]
    end

    subgraph "Performance"
        CACHE[Cache Strategy<br/>Service Worker]
        CDN[CDN Distribution<br/>Cloudflare]
        MINIFY[Minificação<br/>CSS/JS]
    end

    subgraph "Mobile"
        RESPONSIVE[Responsive Design<br/>TailwindCSS]
        TOUCH[Touch Events<br/>Otimizados]
        BATTERY[Battery Optimization<br/>Sensores]
    end

    LAZY --> CACHE
    GLTF --> CDN
    LOD --> BATTERY
    RESPONSIVE --> TOUCH
```

## Integração de APIs Externas

```mermaid
graph LR
    subgraph "APIs do Navegador"
        GEOL2[Geolocation API]
        DEVICE2[Device Orientation API]
        MEDIA2[MediaDevices API]
        AUDIO2[Web Audio API]
        STORAGE2[IndexedDB API]
    end

    subgraph "APIs de Terceiros"
        GMAPS[Google Maps API]
        ARJS2[AR.js Library]
        THREE2[Three.js Library]
        DEXIE2[Dexie.js ORM]
    end

    subgraph "Serviços de Infraestrutura"
        CF2[Cloudflare<br/>DNS & CDN]
        HEROKU2[Heroku<br/>PaaS]
        GITHUB2[GitHub Pages<br/>Static Assets]
    end

    GEOL2 --> GMAPS
    DEVICE2 --> ARJS2
    MEDIA2 --> ARJS2
    AUDIO2 --> THREE2
    STORAGE2 --> DEXIE2

    GMAPS --> CF2
    ARJS2 --> HEROKU2
    THREE2 --> GITHUB2
```

## Modelo de Dados Detalhado

```mermaid
classDiagram
    class Statue {
        +int id
        +string name
        +string normalizedName
        +string location
        +string[] coordinates
        +string subtitle
        +string rangeLife
        +boolean visited
        +string bio
        +string cover
        +Poem[] poems
        +Image[] images
        +getDistanceFromUser()
        +markAsVisited()
    }

    class Poem {
        +string title
        +string normalizedTitle
        +boolean visited
        +number[] scale
        +number[] position
        +number[] rotation
        +string audioUrl
        +string model3DUrl
        +playAudio()
        +loadModel3D()
    }

    class User {
        +int id
        +boolean firstAccess
        +int totalScore
        +Date lastAccess
        +Statue[] visitedStatues
        +Poem[] experiencedPoems
        +updateScore()
        +markFirstAccess()
    }

    class Image {
        +string label
        +string pic
        +string alt
        +string description
    }

    class ScoreService {
        +int currentScore
        +addPoints(points)
        +getTotalScore()
        +saveToIndexedDB()
    }

    class StatuesService {
        +Statue[] getAllStatues()
        +Statue getStatueById(id)
        +Statue[] getNearbyStatues(location)
        +updateStatueData(id, data)
    }

    Statue ||--o{ Poem : contains
    Statue ||--o{ Image : has
    User ||--o{ Statue : visits
    User ||--o{ Poem : experiences
    ScoreService --> User : manages
    StatuesService --> Statue : manages
```

## Fluxo de Sincronização Áudio-Visual

```mermaid
sequenceDiagram
    participant U as Usuário
    participant AR as AR.js
    participant THREE as Three.js
    participant AUDIO as Web Audio API
    participant ANIM as Animation Mixer
    participant TIMER as RequestAnimationFrame

    U->>AR: Clica para ativar
    AR->>THREE: Carrega modelo 3D
    THREE->>ANIM: Inicializa animação
    AR->>AUDIO: Carrega áudio
    AUDIO->>AUDIO: Prepara buffer

    Note over U: Sincronização Iniciada
    AR->>TIMER: Inicia loop de renderização
    TIMER->>ANIM: Atualiza frame de animação
    TIMER->>AUDIO: Sincroniza tempo de áudio
    ANIM->>THREE: Renderiza frame
    THREE->>U: Exibe modelo animado
    AUDIO->>U: Reproduz áudio sincronizado

    Note over U: Loop Contínuo
    loop A cada frame
        TIMER->>ANIM: Próximo frame
        TIMER->>AUDIO: Verifica sincronia
        ANIM->>THREE: Renderiza
        THREE->>U: Atualiza visual
    end

    Note over U: Conclusão
    AUDIO->>AR: Áudio finalizado
    AR->>U: Experiência completa
```

## Notas de Implementação

### Características dos Diagramas:

1. **Arquitetura Geral**: Mostra a separação clara entre frontend, backend e infraestrutura
2. **Fluxo de RA**: Detalha o processo em duas etapas conforme descrito na tese
3. **Stack Tecnológica**: Organiza as tecnologias por responsabilidade
4. **Estrutura de Dados**: Representa o modelo de dados real implementado
5. **Experiência do Usuário**: Mapeia a jornada completa do usuário
6. **Integração de Sensores**: Mostra como os sensores se conectam ao sistema

### Benefícios para a Tese:

- **Clareza Visual**: Facilita a compreensão de conceitos complexos
- **Documentação Técnica**: Serve como referência para implementações futuras
- **Comunicação**: Ajuda a explicar o sistema para diferentes audiências
- **Validação**: Confirma a coerência entre descrição textual e implementação
- **Evolução**: Base para planejamento de melhorias e escalabilidade
