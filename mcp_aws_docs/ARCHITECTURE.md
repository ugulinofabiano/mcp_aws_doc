# Documentação da Arquitetura - AWS Docs MCP Server

## Visão Geral

O **AWS Docs MCP Server** é um servidor que implementa o protocolo MCP (Model Context Protocol) para fornecer acesso programático à documentação da AWS. O servidor permite que clientes MCP (como Claude Desktop) consultem informações sobre serviços AWS, documentação técnica e preços através de uma interface padronizada.

## Arquitetura do Sistema

### Diagrama de Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │    │   MCP Server     │    │  AWS Services   │
│  (Claude Desktop)│◄──►│  (aws-docs-mcp)  │◄──►│  Documentation  │
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

### SearchResult
```typescript
interface SearchResult {
  title: string;           // Título do resultado
  url: string;            // URL da documentação
  snippet: string;        // Resumo do conteúdo
  service?: string;       // Serviço AWS relacionado
  relevanceScore?: number; // Score de relevância (0-100)
}
```

### ServiceInfo
```typescript
interface ServiceInfo {
  name: string;              // Nome técnico do serviço
  displayName: string;       // Nome para exibição
  description: string;       // Descrição do serviço
  category: string;          // Categoria (compute, storage, etc.)
  documentationUrl: string;  // URL da documentação
}
```

### PricingInfo
```typescript
interface PricingInfo {
  service: string;           // Nome do serviço
  region?: string;          // Região AWS
  pricingDetails: {         // Detalhes de preços
    model: string;
    price: string;
    unit: string;
    description?: string;
  }[];
  lastUpdated: string;      // Data da última atualização
}
```

## Fluxo de Comunicação

### 1. Inicialização do Servidor
```
1. Cliente MCP inicia o servidor
2. Servidor carrega configurações e dependências
3. Servidor registra handlers para ferramentas
4. Servidor inicia transporte stdio
5. Servidor fica aguardando requisições
```

### 2. Processamento de Requisições
```
1. Cliente envia requisição MCP
2. Servidor valida requisição
3. Servidor roteia para handler apropriado
4. Handler chama AWS Docs Service
5. Service executa web scraping ou retorna dados mock
6. Servidor formata resposta
7. Cliente recebe resposta
```

## Estratégias de Fallback

### 1. Web Scraping com Fallback
- **Primário**: Web scraping da documentação oficial AWS
- **Fallback**: Dados mock quando scraping falha
- **Benefícios**: Garante disponibilidade mesmo com mudanças na estrutura das páginas

### 2. Timeout e Error Handling
- **Timeout**: 10 segundos para requisições HTTP
- **Error Handling**: Captura e log de erros
- **Graceful Degradation**: Retorna dados mock em caso de erro

## Configuração e Deploy

### Desenvolvimento
```bash
npm install          # Instalar dependências
npm run build        # Compilar TypeScript
npm run dev          # Executar em modo desenvolvimento
```

### Produção
```bash
npm run build        # Compilar para JavaScript
npm start           # Executar versão compilada
```

### Configuração MCP
```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {}
    }
  }
}
```

## Dependências Técnicas

### Core Dependencies
- **`@modelcontextprotocol/sdk`**: SDK oficial do MCP
- **`axios`**: Cliente HTTP para requisições
- **`cheerio`**: Parser HTML para web scraping
- **`zod`**: Validação de esquemas

### Dev Dependencies
- **`typescript`**: Compilador TypeScript
- **`tsx`**: Executor TypeScript para desenvolvimento
- **`@types/node`**: Tipos TypeScript para Node.js
- **`jest`**: Framework de testes

## Limitações e Considerações

### Limitações Atuais
1. **Web Scraping**: Dependente da estrutura das páginas AWS
2. **Rate Limiting**: Sem controle de rate limiting
3. **Cache**: Sem sistema de cache implementado
4. **Autenticação**: Sem autenticação AWS

### Melhorias Futuras
1. **API Oficial**: Migrar para APIs oficiais da AWS quando disponíveis
2. **Cache Redis**: Implementar cache para melhor performance
3. **Rate Limiting**: Adicionar controle de taxa de requisições
4. **Autenticação**: Suporte a credenciais AWS
5. **Métricas**: Adicionar logging e métricas de uso

## Segurança

### Considerações de Segurança
1. **Input Validation**: Validação de entrada usando Zod
2. **Error Handling**: Não exposição de informações sensíveis em erros
3. **Timeout**: Prevenção de requisições longas
4. **Sandbox**: Execução em ambiente controlado

### Recomendações
1. **HTTPS**: Todas as requisições usam HTTPS
2. **Validation**: Validação rigorosa de parâmetros de entrada
3. **Logging**: Log de erros sem exposição de dados sensíveis

## Monitoramento e Logs

### Logs Atuais
- **Startup**: Log de inicialização do servidor
- **Errors**: Log de erros de scraping e requisições
- **Console**: Output via console.error para compatibilidade MCP

### Métricas Sugeridas
- **Request Count**: Número de requisições por ferramenta
- **Response Time**: Tempo de resposta das requisições
- **Error Rate**: Taxa de erro por ferramenta
- **Cache Hit Rate**: Taxa de acerto do cache (quando implementado)

## Conclusão

O AWS Docs MCP Server implementa uma arquitetura robusta e escalável para fornecer acesso programático à documentação da AWS. A arquitetura modular permite fácil manutenção e extensão, enquanto as estratégias de fallback garantem alta disponibilidade. O uso do protocolo MCP padroniza a interface, permitindo integração com diversos clientes MCP.
