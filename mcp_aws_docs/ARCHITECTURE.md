# Documentação da Arquitetura - AWS Docs MCP Server

## Visão Geral

O **AWS Docs MCP Server** é um servidor que implementa o protocolo MCP (Model Context Protocol) para fornecer acesso programático à documentação da AWS. O servidor permite que o Cursor (IDE) consulte informações sobre serviços AWS, documentação técnica e preços através de uma interface padronizada.

## Arquitetura do Sistema

### Diagrama de Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Cursor      │    │   MCP Server     │    │  AWS Services   │
│      (IDE)      │◄──►│  (aws-docs-mcp)  │◄──►│  Documentation  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  AWS Docs Service│
                       │  (Web Scraping)  │
                       └──────────────────┘
```

### Componentes Principais

#### 1. **MCP Server Core** (`src/index.ts`)
- **Responsabilidade**: Ponto de entrada do servidor MCP
- **Funcionalidades**:
  - Implementa o protocolo MCP usando `@modelcontextprotocol/sdk`
  - Gerencia transporte stdio para comunicação com clientes
  - Define e expõe ferramentas (tools) disponíveis
  - Roteia requisições para handlers apropriados

#### 2. **AWS Documentation Service** (`src/services/aws-docs-service.ts`)
- **Responsabilidade**: Lógica de negócio para consulta de documentação AWS
- **Funcionalidades**:
  - Web scraping da documentação oficial da AWS
  - Fallback para dados mock quando scraping falha
  - Cache e otimização de requisições
  - Parsing de HTML usando Cheerio

#### 3. **Type Definitions** (`src/types/tool.ts`)
- **Responsabilidade**: Definições de tipos TypeScript
- **Interfaces**:
  - `Tool`: Estrutura de ferramentas MCP
  - `SearchResult`: Resultados de busca
  - `ServiceInfo`: Informações de serviços AWS
  - `PricingInfo`: Informações de preços

## Ferramentas MCP Disponíveis

### 1. `search_aws_docs`
**Propósito**: Busca na documentação da AWS por tópicos específicos

**Parâmetros**:
- `query` (obrigatório): Termo de busca
- `service` (opcional): Serviço AWS específico
- `maxResults` (opcional): Número máximo de resultados (padrão: 10)

**Fluxo de Execução**:
```
Cliente → MCP Server → AWS Docs Service → Web Scraping → Resultados
```

### 2. `get_aws_service_docs`
**Propósito**: Obtém documentação detalhada de um serviço AWS

**Parâmetros**:
- `serviceName` (obrigatório): Nome do serviço
- `topic` (opcional): Tópico específico

**Fluxo de Execução**:
```
Cliente → MCP Server → AWS Docs Service → Documentação Específica
```

### 3. `list_aws_services`
**Propósito**: Lista todos os serviços AWS disponíveis

**Parâmetros**:
- `category` (opcional): Categoria para filtrar

**Fluxo de Execução**:
```
Cliente → MCP Server → AWS Docs Service → Lista de Serviços
```

### 4. `get_aws_pricing_info`
**Propósito**: Obtém informações de preços dos serviços

**Parâmetros**:
- `serviceName` (obrigatório): Nome do serviço
- `region` (opcional): Região AWS

**Fluxo de Execução**:
```
Cliente → MCP Server → AWS Docs Service → Informações de Preços
```

## Estrutura de Dados

O servidor retorna dados estruturados em JSON para cada ferramenta:

- **SearchResult**: Resultados de busca com título, URL, snippet e score de relevância
- **ServiceInfo**: Informações de serviços com nome, descrição e categoria
- **PricingInfo**: Informações de preços com modelos, valores e unidades

## Fluxo de Comunicação

### Processamento de Requisições
```
1. Cursor envia requisição MCP via stdio
2. Servidor valida e roteia para handler apropriado
3. Handler chama AWS Docs Service
4. Service executa web scraping ou retorna dados mock
5. Servidor formata resposta JSON
6. Cursor recebe e exibe os dados
```

## Estratégias de Fallback

- **Primário**: Web scraping da documentação oficial AWS
- **Fallback**: Dados mock quando scraping falha
- **Timeout**: 10 segundos para requisições HTTP
- **Error Handling**: Retorna dados mock em caso de erro

## Configuração

### Instalação
```bash
npm install          # Instalar dependências
npm run build        # Compilar TypeScript
npm run dev          # Executar em modo desenvolvimento
```

### Configuração no Cursor
Adicione ao arquivo de configuração MCP do Cursor:
```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "node",
      "args": ["C:\\Users\\uguli\\mcp_aws_docs\\dist\\index.js"],
      "env": {}
    }
  }
}
```

## Dependências Principais

- **`@modelcontextprotocol/sdk`**: SDK oficial do MCP
- **`axios`**: Cliente HTTP para requisições
- **`cheerio`**: Parser HTML para web scraping
- **`zod`**: Validação de esquemas

## Limitações

- **Web Scraping**: Dependente da estrutura das páginas AWS
- **Sem Cache**: Dados são buscados a cada requisição
- **Sem Rate Limiting**: Sem controle de taxa de requisições

## Segurança

- **Validação de Entrada**: Usando Zod schemas
- **HTTPS**: Todas as requisições usam HTTPS
- **Error Handling**: Não exposição de informações sensíveis
