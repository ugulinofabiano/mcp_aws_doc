# Especificações Técnicas - AWS Docs MCP Server

## Visão Geral Técnica

O AWS Docs MCP Server é implementado em TypeScript/Node.js e segue as especificações do Model Context Protocol (MCP) para fornecer acesso programático à documentação da AWS.

## Especificações do Protocolo MCP

### Versão do Protocolo
- **MCP Version**: 0.5.0
- **Transport**: stdio (Standard Input/Output)
- **Encoding**: UTF-8 JSON

### Mensagens MCP Suportadas

#### 1. ListTools Request
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

#### 2. CallTool Request
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "search_aws_docs",
    "arguments": {
      "query": "auto scaling",
      "service": "ec2",
      "maxResults": 5
    }
  }
}
```

## Implementação Técnica

### Estrutura de Arquivos
```
src/
├── index.ts                    # Entry point (214 lines)
├── services/
│   └── aws-docs-service.ts     # Core service logic (349 lines)
└── types/
    └── tool.ts                 # Type definitions (38 lines)
```

### Dependências Principais

#### Runtime Dependencies
```json
{
  "@modelcontextprotocol/sdk": "^0.5.0",  // MCP SDK oficial
  "axios": "^1.6.0",                      // HTTP client
  "cheerio": "^1.0.0-rc.12",             // HTML parser
  "zod": "^3.22.0"                       // Schema validation
}
```

#### Development Dependencies
```json
{
  "@types/node": "^20.0.0",     // Node.js types
  "tsx": "^4.0.0",              // TypeScript executor
  "typescript": "^5.0.0",       // TypeScript compiler
  "jest": "^29.0.0",            // Testing framework
  "@types/jest": "^29.0.0"      // Jest types
}
```

### Configuração TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2022",                    // Target ES2022
    "module": "ESNext",                    // ES modules
    "moduleResolution": "node",            // Node.js resolution
    "esModuleInterop": true,               // ES module interop
    "allowSyntheticDefaultImports": true,  // Synthetic imports
    "strict": true,                        // Strict mode
    "skipLibCheck": true,                  // Skip lib checks
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",                    // Output directory
    "rootDir": "./src",                    // Source directory
    "declaration": true,                   // Generate declarations
    "declarationMap": true,                // Declaration maps
    "sourceMap": true,                     // Source maps
    "resolveJsonModule": true              // JSON module resolution
  }
}
```

## Detalhes de Implementação

### 1. MCP Server Core (`src/index.ts`)

#### Classe Principal
```typescript
class AwsDocsMCPServer {
  private server: Server;
  private awsDocsService: AwsDocumentationService;
  
  constructor() {
    this.server = new Server({
      name: 'aws-docs-mcp',
      version: '1.0.0'
    }, {
      capabilities: { tools: {} }
    });
  }
}
```

#### Handlers de Ferramentas
- **ListToolsHandler**: Retorna lista de ferramentas disponíveis
- **CallToolHandler**: Processa chamadas de ferramentas específicas

#### Tratamento de Erros
```typescript
catch (error) {
  return {
    content: [{
      type: 'text',
      text: `Error executing tool ${name}: ${error.message}`
    }]
  };
}
```

### 2. AWS Documentation Service (`src/services/aws-docs-service.ts`)

#### URLs Base
```typescript
private readonly awsDocsBaseUrl = 'https://docs.aws.amazon.com';
private readonly awsServicesUrl = 'https://aws.amazon.com/services';
private readonly awsPricingUrl = 'https://aws.amazon.com/pricing';
```

#### Configuração HTTP
```typescript
const response = await axios.get(url, {
  params: { q: query },
  timeout: 10000  // 10 segundos timeout
});
```

#### Web Scraping com Cheerio
```typescript
const $ = cheerio.load(response.data);
$('.search-result-item, .result-item, .search-hit').each((index, element) => {
  // Extract data from HTML elements
});
```

#### Estratégia de Fallback
- **Primary**: Web scraping da documentação oficial
- **Fallback**: Dados mock quando scraping falha
- **Error Handling**: Log de erros e retorno de dados mock

### 3. Type Definitions (`src/types/tool.ts`)

#### Interface Tool
```typescript
export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}
```

#### Interfaces de Dados
- **SearchResult**: Resultados de busca
- **ServiceInfo**: Informações de serviços
- **PricingInfo**: Informações de preços

## Ferramentas Implementadas

### 1. search_aws_docs

#### Schema de Entrada
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Search query for AWS documentation"
    },
    "service": {
      "type": "string",
      "description": "Optional AWS service name to limit search scope"
    },
    "maxResults": {
      "type": "number",
      "description": "Maximum number of results to return (default: 10)",
      "default": 10
    }
  },
  "required": ["query"]
}
```

#### Implementação
```typescript
async searchDocumentation(query: string, service?: string, maxResults: number = 10): Promise<SearchResult[]> {
  const searchUrl = service 
    ? `${this.awsDocsBaseUrl}/${service}/latest/developerguide/`
    : this.awsDocsBaseUrl;
  
  // Web scraping logic...
  // Fallback to mock data if scraping fails
}
```

### 2. get_aws_service_docs

#### Schema de Entrada
```json
{
  "type": "object",
  "properties": {
    "serviceName": {
      "type": "string",
      "description": "Name of the AWS service (e.g., ec2, s3, lambda)"
    },
    "topic": {
      "type": "string",
      "description": "Optional specific topic within the service documentation"
    }
  },
  "required": ["serviceName"]
}
```

### 3. list_aws_services

#### Schema de Entrada
```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "description": "Optional category to filter services (e.g., compute, storage, database)"
    }
  }
}
```

### 4. get_aws_pricing_info

#### Schema de Entrada
```json
{
  "type": "object",
  "properties": {
    "serviceName": {
      "type": "string",
      "description": "Name of the AWS service"
    },
    "region": {
      "type": "string",
      "description": "AWS region (e.g., us-east-1, eu-west-1)"
    }
  },
  "required": ["serviceName"]
}
```

## Dados Mock

### Serviços AWS Mock
```typescript
private getMockServices(category?: string): ServiceInfo[] {
  const allServices: ServiceInfo[] = [
    {
      name: 'ec2',
      displayName: 'Amazon EC2',
      description: 'Virtual servers in the cloud',
      category: 'compute',
      documentationUrl: 'https://docs.aws.amazon.com/ec2/latest/developerguide/'
    },
    // ... mais serviços
  ];
}
```

### Preços Mock
```typescript
private getMockPricingInfo(serviceName: string, region?: string): PricingInfo {
  const mockPricing: Record<string, any[]> = {
    ec2: [
      {
        model: 't3.micro',
        price: '$0.0104',
        unit: 'per hour',
        description: '1 vCPU, 1 GB RAM'
      }
      // ... mais modelos
    ]
  };
}
```

## Performance e Otimização

### Timeouts
- **HTTP Requests**: 10 segundos
- **Total Request**: Sem limite (controlado pelo cliente MCP)

### Memory Usage
- **Base**: ~50MB (Node.js + dependências)
- **Per Request**: ~1-5MB (dependendo do tamanho da resposta)

### Caching
- **Atual**: Sem cache implementado
- **Recomendado**: Redis ou in-memory cache para dados frequentemente acessados

## Segurança

### Validação de Entrada
```typescript
// Validação usando Zod schemas
const schema = z.object({
  query: z.string().min(1).max(1000),
  service: z.string().optional(),
  maxResults: z.number().min(1).max(100).default(10)
});
```

### Sanitização
- **HTML**: Cheerio automaticamente sanitiza HTML
- **URLs**: Validação de URLs antes de fazer requisições
- **Input**: Validação de parâmetros de entrada

### Error Handling
- **Não exposição**: Erros internos não são expostos ao cliente
- **Logging**: Erros são logados para debugging
- **Graceful Degradation**: Fallback para dados mock

## Monitoramento

### Logs Atuais
```typescript
console.error('AWS Docs MCP Server running on stdio');
console.error('Error searching AWS documentation:', error);
```

### Métricas Sugeridas
- **Request Count**: Por ferramenta
- **Response Time**: P50, P95, P99
- **Error Rate**: Por ferramenta
- **Cache Hit Rate**: Quando cache for implementado

## Limitações Conhecidas

### Web Scraping
1. **Estrutura de Páginas**: Dependente da estrutura HTML da AWS
2. **Rate Limiting**: Sem controle de taxa de requisições
3. **Anti-Bot**: Possível bloqueio por sistemas anti-bot

### Performance
1. **Latência**: Web scraping adiciona latência
2. **Confiabilidade**: Dependente da disponibilidade dos sites AWS
3. **Escalabilidade**: Sem cache ou pooling de conexões

### Funcionalidade
1. **Busca Limitada**: Não usa APIs de busca da AWS
2. **Dados Estáticos**: Dados mock podem estar desatualizados
3. **Regiões**: Suporte limitado a regiões específicas

## Roadmap Técnico

### Curto Prazo (1-3 meses)
- [ ] Implementar cache in-memory
- [ ] Adicionar rate limiting
- [ ] Melhorar error handling
- [ ] Adicionar testes unitários

### Médio Prazo (3-6 meses)
- [ ] Migrar para APIs oficiais da AWS
- [ ] Implementar cache Redis
- [ ] Adicionar autenticação AWS
- [ ] Implementar métricas e monitoring

### Longo Prazo (6+ meses)
- [ ] Suporte a múltiplas regiões
- [ ] Cache distribuído
- [ ] Load balancing
- [ ] High availability
