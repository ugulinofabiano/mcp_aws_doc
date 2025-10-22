# AWS Documentation MCP Server

Este é um servidor MCP (Model Context Protocol) que permite consultar informações da documentação da AWS de forma programática.

## Funcionalidades

O servidor MCP fornece as seguintes ferramentas:

### 1. `search_aws_docs`
Busca na documentação da AWS por tópicos ou serviços específicos.

**Parâmetros:**
- `query` (obrigatório): Termo de busca na documentação AWS
- `service` (opcional): Nome do serviço AWS para limitar o escopo da busca
- `maxResults` (opcional): Número máximo de resultados (padrão: 10)

**Exemplo:**
```json
{
  "name": "search_aws_docs",
  "arguments": {
    "query": "auto scaling",
    "service": "ec2",
    "maxResults": 5
  }
}
```

### 2. `get_aws_service_docs`
Obtém documentação detalhada para um serviço AWS específico.

**Parâmetros:**
- `serviceName` (obrigatório): Nome do serviço AWS (ex: ec2, s3, lambda)
- `topic` (opcional): Tópico específico dentro da documentação do serviço

**Exemplo:**
```json
{
  "name": "get_aws_service_docs",
  "arguments": {
    "serviceName": "lambda",
    "topic": "getting-started"
  }
}
```

### 3. `list_aws_services`
Lista todos os serviços AWS disponíveis com suas descrições.

**Parâmetros:**
- `category` (opcional): Categoria para filtrar serviços (ex: compute, storage, database)

**Exemplo:**
```json
{
  "name": "list_aws_services",
  "arguments": {
    "category": "compute"
  }
}
```

### 4. `get_aws_pricing_info`
Obtém informações de preços para serviços AWS.

**Parâmetros:**
- `serviceName` (obrigatório): Nome do serviço AWS
- `region` (opcional): Região AWS (ex: us-east-1, eu-west-1)

**Exemplo:**
```json
{
  "name": "get_aws_pricing_info",
  "arguments": {
    "serviceName": "ec2",
    "region": "us-east-1"
  }
}
```

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd aws-docs-mcp
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

## Uso

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Configuração MCP

Para usar este servidor MCP com o Claude Desktop ou outro cliente MCP, adicione a seguinte configuração:

### Claude Desktop (config.json)
```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "node",
      "args": ["path/to/aws-docs-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

### Outros clientes MCP
O servidor usa transporte stdio e pode ser usado com qualquer cliente MCP compatível.

## Estrutura do Projeto

```
src/
├── index.ts                 # Ponto de entrada do servidor MCP
├── types/
│   └── tool.ts             # Definições de tipos TypeScript
└── services/
    └── aws-docs-service.ts # Serviço principal para consultar AWS
```

## Dependências

- `@modelcontextprotocol/sdk`: SDK oficial do MCP
- `axios`: Cliente HTTP para fazer requisições
- `cheerio`: Parser HTML para extrair dados das páginas
- `zod`: Validação de esquemas

## Limitações

- Este servidor usa web scraping para obter informações da AWS, que pode ser limitado pela estrutura das páginas
- Para uso em produção, considere usar APIs oficiais da AWS quando disponíveis
- As informações de preços são aproximadas e podem não estar sempre atualizadas

## Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request para sugerir melhorias.

## Licença

MIT
