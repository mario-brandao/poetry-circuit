# Diagramas de Arquitetura - Circuito Digital da Poesia

## 1. Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Camada de Apresentação e Lógica (Frontend - Angular)"
        UI[Interface do Usuário]
        AR[Realidade Aumentada<br/>AR.js + Three.js]
        MAP[Geolocalização<br/>Google Maps API]
        LOGIC[Lógica de Negócio<br/>Gamificação & Progresso]
    end

    subgraph "Camada de Persistência e Dados"
        IDB[(IndexedDB<br/>Dexie.js)]
        JSON[writers.json<br/>Dados das Estátuas]
        STATIC[Servidor Estático<br/>Node.js + Express]
    end

    subgraph "Infraestrutura de Publicação"
        CF[Cloudflare<br/>DNS, SSL, CDN]
        HEROKU[Heroku<br/>PaaS]
        GITHUB[GitHub Pages<br/>Assets Estáticos]
        GODADDY[GoDaddy<br/>Registro de Domínio]
    end

    UI --> AR
    UI --> MAP
    UI --> LOGIC
    LOGIC --> IDB
    LOGIC --> JSON
    STATIC --> UI
    CF --> HEROKU
    CF --> GITHUB
    GODADDY --> CF
    HEROKU --> STATIC
```

## 2. Fluxo de Ativação da Realidade Aumentada

```mermaid
sequenceDiagram
    participant U as Usuário
    participant GPS as GPS/Navegador
    participant MAP as Google Maps
    participant CAM as Câmera
    participant AR as AR.js
    participant THREE as Three.js
    participant AUDIO as Web Audio API

    Note over U: Etapa 1: Reconhecimento por Geolocalização
    U->>GPS: Acessa aplicação
    GPS->>MAP: Obtém posição atual
    MAP->>U: Mostra posição no mapa
    GPS->>MAP: Verifica proximidade com estátua
    MAP->>U: Habilita interação (raio ≤ 20m)

    Note over U: Etapa 2: Reconhecimento Visual por Marcador
    U->>CAM: Aponta câmera para marcador
    CAM->>AR: Feed de vídeo
    AR->>AR: Detecta padrão .patt
    AR->>THREE: Calcula posição/orientação
    THREE->>U: Renderiza modelo 3D
    AR->>AUDIO: Ativa áudio sincronizado
    AUDIO->>U: Reproduz poema narrado
```

## 3. Stack Tecnológica e Infraestrutura

```mermaid
graph LR
    subgraph "Frontend"
        ANGULAR[Angular 16<br/>TypeScript]
        SCSS[SCSS<br/>TailwindCSS]
        COMP[Componentes<br/>Reativos]
    end

    subgraph "Realidade Aumentada"
        ARJS[AR.js<br/>Detecção de Marcadores]
        THREE[Three.js<br/>Renderização 3D]
        WEBGL[WebGL<br/>Aceleração Gráfica]
    end

    subgraph "Backend"
        NODE[Node.js<br/>Runtime]
        EXPRESS[Express<br/>Servidor HTTP]
        STATIC[Arquivos Estáticos]
    end

    subgraph "Persistência"
        IDB2[IndexedDB<br/>Armazenamento Local]
        DEXIE[Dexie.js<br/>ORM]
        JSON2[writers.json<br/>Dados das Estátuas]
    end

    subgraph "Infraestrutura"
        HEROKU2[Heroku<br/>Hospedagem PaaS]
        CF2[Cloudflare<br/>CDN & SSL]
        GITHUB2[GitHub Pages<br/>Assets Pesados]
        GODADDY2[GoDaddy<br/>Domínio]
    end

    ANGULAR --> ARJS
    ARJS --> THREE
    THREE --> WEBGL
    ANGULAR --> IDB2
    IDB2 --> DEXIE
    DEXIE --> JSON2
    NODE --> EXPRESS
    EXPRESS --> STATIC
    HEROKU2 --> NODE
    CF2 --> HEROKU2
    CF2 --> GITHUB2
    GODADDY2 --> CF2
```

## 4. Estrutura de Dados

```mermaid
erDiagram
    STATUE {
        int id PK
        string name
        string normalizedName
        string location
        string[] coordinates
        string subtitle
        string rangeLife
        boolean visited
        string bio
        string cover
    }

    POEM {
        string title
        string normalizedTitle
        boolean visited
        number[] scale
        number[] position
        number[] rotation
    }

    USER {
        int id PK
        boolean firstAccess
    }

    IMAGE {
        string label
        string pic
    }

    STATUE ||--o{ POEM : "contém"
    STATUE ||--o{ IMAGE : "possui"
    USER ||--o{ STATUE : "visita"
    USER ||--o{ POEM : "experimenta"
```

## 5. Fluxo de Experiência do Usuário

```mermaid
journey
    title Experiência do Usuário - Circuito Digital da Poesia
    section Descoberta
      Acessar aplicação: 5: Usuário
      Visualizar mapa: 5: Usuário
      Ver pontos de interesse: 4: Usuário
    section Navegação
      Geolocalização ativa: 4: Usuário
      Navegar até estátua: 3: Usuário
      Aproximar-se do local: 4: Usuário
    section Interação
      Ativar câmera: 5: Usuário
      Apontar para marcador: 4: Usuário
      Experiência em RA: 5: Usuário
    section Gamificação
      Ouvir poema: 5: Usuário
      Ganhar pontos: 4: Usuário
      Ver progresso: 3: Usuário
    section Conclusão
      Completar circuito: 5: Usuário
      Desbloquear recompensa: 4: Usuário
```

## 9. Integração de Sensores e APIs

```mermaid
graph TD
    subgraph "Dispositivo Móvel"
        GPS[GPS<br/>Geolocalização]
        GYRO[Giroscópio<br/>Orientação]
        MAG[Magnetômetro<br/>Bússola Digital]
        CAM2[Câmera<br/>WebRTC]
    end

    subgraph "APIs do Navegador"
        GEOL[Geolocation API]
        DEVICE[Device Orientation API]
        MEDIA[MediaDevices API]
        WEBGL2[WebGL API]
    end

    subgraph "Sistema"
        AR2[AR.js<br/>Processamento]
        THREE2[Three.js<br/>Renderização]
        ANGULAR2[Angular<br/>Lógica]
        AUDIO2[Web Audio API<br/>Sincronização]
    end

    GPS --> GEOL
    GYRO --> DEVICE
    MAG --> DEVICE
    CAM2 --> MEDIA

    GEOL --> ANGULAR2
    DEVICE --> AR2
    MEDIA --> AR2

    AR2 --> THREE2
    THREE2 --> WEBGL2
    ANGULAR2 --> AUDIO2

    ANGULAR2 --> AR2
    AR2 --> ANGULAR2
```

## Legenda dos Diagramas

### Símbolos Utilizados:

- **Retângulos**: Componentes/Entidades
- **Círculos**: Pontos de decisão/processamento
- **Losangos**: Condições/verificações
- **Setas**: Fluxo de dados/controle
- **Subgraphs**: Agrupamentos lógicos

### Cores e Estilos:

- **Azul**: Componentes frontend
- **Verde**: Componentes backend/infraestrutura
- **Laranja**: APIs e serviços externos
- **Roxo**: Dados e persistência
- **Cinza**: Infraestrutura de rede

### Notas Técnicas:

- Todos os diagramas seguem padrões UML e Mermaid
- As relações mostram dependências reais do sistema
- Os fluxos representam o comportamento descrito na tese
- A arquitetura reflete o estado atual do MVP
