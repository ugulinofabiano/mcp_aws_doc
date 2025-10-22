# Especificações Técnicas - AWS Docs MCP Server

## Visão Geral

Servidor MCP implementado em TypeScript/Node.js que fornece acesso à documentação da AWS através do protocolo MCP para integração com o Cursor IDE.

## Protocolo MCP

- **Versão**: 0.5.0
- **Transporte**: stdio (Standard Input/Output)
- **Encoding**: UTF-8 JSON

### Mensagens Suportadas
- **ListTools**: Lista ferramentas disponíveis
- **CallTool**: Executa ferramentas específicas

## Estrutura do Projeto

```
src/
├── index.ts                    # Servidor MCP principal
├── services/
│   └── aws-docs-service.ts     # Lógica de negócio
└── types/
    └── tool.ts                 # Definições de tipos
```

## Dependências

### Runtime
- `@modelcontextprotocol/sdk`: SDK oficial do MCP
- `axios`: Cliente HTTP
- `cheerio`: Parser HTML
- `zod`: Validação de esquemas

### Desenvolvimento
- `typescript`: Compilador TypeScript
- `tsx`: Executor TypeScript
- `@types/node`: Tipos Node.js

## Implementação

### MCP Server Core
- Gerencia protocolo MCP e comunicação com Cursor
- Roteia requisições para handlers apropriados
- Trata erros e formata respostas

### AWS Docs Service
- Web scraping da documentação oficial AWS
- Fallback para dados mock quando scraping falha
- Parsing HTML com Cheerio
- Timeout de 10 segundos para requisições

### Type Definitions
- Interfaces TypeScript para ferramentas e dados
- Validação de entrada com Zod schemas

## Ferramentas MCP

### 1. search_aws_docs
Busca na documentação AWS por tópicos específicos
- **Parâmetros**: query (obrigatório), service (opcional), maxResults (opcional)

### 2. get_aws_service_docs
Obtém documentação detalhada de um serviço AWS
- **Parâmetros**: serviceName (obrigatório), topic (opcional)

### 3. list_aws_services
Lista todos os serviços AWS disponíveis
- **Parâmetros**: category (opcional)

### 4. get_aws_pricing_info
Obtém informações de preços dos serviços
- **Parâmetros**: serviceName (obrigatório), region (opcional)

## Configuração

### Instalação
```bash
npm install
npm run build
npm run dev
```

### Configuração no Cursor
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

## Limitações

- **Web Scraping**: Dependente da estrutura das páginas AWS
- **Sem Cache**: Dados são buscados a cada requisição
- **Sem Rate Limiting**: Sem controle de taxa de requisições
- **Timeout**: 10 segundos para requisições HTTP
