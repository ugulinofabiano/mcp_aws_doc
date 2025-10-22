# Diagramas da Arquitetura - AWS Docs MCP Server

## Diagrama de Arquitetura Geral

```mermaid
graph TB
    subgraph "Cliente MCP"
        A[Claude Desktop]
        B[Outros Clientes MCP]
    end
    
    subgraph "AWS Docs MCP Server"
        C[MCP Server Core]
        D[Tool Handlers]
        E[AWS Docs Service]
    end
    
    subgraph "Fontes de Dados"
        F[AWS Documentation]
        G[AWS Services Page]
        H[AWS Pricing Page]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#e8f5e8
    style G fill:#e8f5e8
    style H fill:#e8f5e8
```

## Fluxo de Comunicação MCP

```mermaid
sequenceDiagram
    participant Client as Cliente MCP
    participant Server as MCP Server
    participant Service as AWS Docs Service
    participant AWS as AWS Documentation
    
    Client->>Server: ListTools Request
    Server->>Client: Available Tools
    
    Client->>Server: CallTool Request
    Server->>Service: Process Tool Call
    Service->>AWS: Web Scraping Request
    AWS-->>Service: HTML Response
    Service->>Service: Parse & Extract Data
    Service-->>Server: Structured Data
    Server->>Client: Tool Response
```

## Estrutura de Componentes

```mermaid
graph TD
    subgraph "src/"
        A[index.ts<br/>MCP Server Core]
        B[services/<br/>aws-docs-service.ts]
        C[types/<br/>tool.ts]
    end
    
    subgraph "Tools"
        D[search_aws_docs]
        E[get_aws_service_docs]
        F[list_aws_services]
        G[get_aws_pricing_info]
    end
    
    subgraph "Data Flow"
        H[Input Validation]
        I[Web Scraping]
        J[Data Parsing]
        K[Mock Data Fallback]
        L[Response Formatting]
    end
    
    A --> D
    A --> E
    A --> F
    A --> G
    
    D --> B
    E --> B
    F --> B
    G --> B
    
    B --> H
    H --> I
    I --> J
    J --> K
    K --> L
    
    style A fill:#ffeb3b
    style B fill:#4caf50
    style C fill:#2196f3
```

## Fluxo de Processamento de Ferramentas

```mermaid
flowchart TD
    A[Requisição MCP] --> B{Tipo de Ferramenta}
    
    B -->|search_aws_docs| C[Buscar Documentação]
    B -->|get_aws_service_docs| D[Obter Docs do Serviço]
    B -->|list_aws_services| E[Listar Serviços]
    B -->|get_aws_pricing_info| F[Obter Preços]
    
    C --> G[Web Scraping AWS Docs]
    D --> H[Web Scraping Serviço Específico]
    E --> I[Web Scraping Página de Serviços]
    F --> J[Web Scraping Página de Preços]
    
    G --> K{Scraping Sucesso?}
    H --> K
    I --> K
    J --> K
    
    K -->|Sim| L[Parse HTML com Cheerio]
    K -->|Não| M[Dados Mock]
    
    L --> N[Estruturar Dados]
    M --> N
    
    N --> O[Validar com Zod]
    O --> P[Formatar Resposta MCP]
    P --> Q[Retornar ao Cliente]
    
    style A fill:#e3f2fd
    style Q fill:#e8f5e8
    style M fill:#fff3e0
```

## Estratégia de Fallback

```mermaid
graph TD
    A[Requisição] --> B[Tentar Web Scraping]
    B --> C{Sucesso?}
    
    C -->|Sim| D[Retornar Dados Reais]
    C -->|Não| E[Log do Erro]
    
    E --> F[Retornar Dados Mock]
    
    D --> G[Resposta Final]
    F --> G
    
    subgraph "Dados Mock Disponíveis"
        H[Search Results Mock]
        I[Service Info Mock]
        J[Pricing Info Mock]
    end
    
    F --> H
    F --> I
    F --> J
    
    style A fill:#e3f2fd
    style D fill:#e8f5e8
    style F fill:#fff3e0
    style G fill:#f3e5f5
```

## Estrutura de Dados

```mermaid
classDiagram
    class Tool {
        +string name
        +string description
        +object inputSchema
    }
    
    class SearchResult {
        +string title
        +string url
        +string snippet
        +string service
        +number relevanceScore
    }
    
    class ServiceInfo {
        +string name
        +string displayName
        +string description
        +string category
        +string documentationUrl
    }
    
    class PricingInfo {
        +string service
        +string region
        +array pricingDetails
        +string lastUpdated
    }
    
    class PricingDetail {
        +string model
        +string price
        +string unit
        +string description
    }
    
    Tool --> SearchResult : produces
    Tool --> ServiceInfo : produces
    Tool --> PricingInfo : produces
    PricingInfo --> PricingDetail : contains
```

## Configuração de Deploy

```mermaid
graph LR
    subgraph "Desenvolvimento"
        A[Source Code] --> B[npm install]
        B --> C[npm run dev]
        C --> D[tsx src/index.ts]
    end
    
    subgraph "Produção"
        E[Source Code] --> F[npm install]
        F --> G[npm run build]
        G --> H[TypeScript Compilation]
        H --> I[dist/index.js]
        I --> J[npm start]
    end
    
    subgraph "Configuração MCP"
        K[claude-desktop-config.json]
        L[Configuração do Cliente]
    end
    
    D --> K
    J --> K
    K --> L
    
    style A fill:#e3f2fd
    style E fill:#e3f2fd
    style I fill:#e8f5e8
    style L fill:#f3e5f5
```
