# Fluxo de Requisição Cursor + MCP AWS Docs

## Diagrama de Sequência Detalhado

Este diagrama mostra como funciona uma requisição completa do usuário no Cursor até a resposta com dados da AWS.

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant Cursor as 🖥️ Cursor IDE
    participant MCP as 🔧 MCP Server
    participant AWS as 📚 AWS Docs Service
    participant Web as 🌐 AWS Website
    
    Note over User, Web: 1. Inicialização do Sistema
    Cursor->>MCP: Inicia servidor MCP
    MCP-->>Cursor: Servidor pronto (stdio)
    
    Note over User, Web: 2. Descoberta de Ferramentas
    Cursor->>MCP: ListTools Request
    MCP-->>Cursor: Lista de ferramentas disponíveis
    Note right of Cursor: 4 ferramentas: search_aws_docs,<br/>get_aws_service_docs,<br/>list_aws_services,<br/>get_aws_pricing_info
    
    Note over User, Web: 3. Requisição do Usuário
    User->>Cursor: "Como configurar auto scaling no EC2?"
    Cursor->>Cursor: Analisa pergunta e identifica ferramenta apropriada
    
    Note over User, Web: 4. Chamada da Ferramenta
    Cursor->>MCP: CallTool Request
    Note right of Cursor: {<br/>  "name": "search_aws_docs",<br/>  "arguments": {<br/>    "query": "auto scaling",<br/>    "service": "ec2",<br/>    "maxResults": 5<br/>  }<br/>}
    
    Note over User, Web: 5. Processamento no MCP Server
    MCP->>MCP: Valida parâmetros de entrada
    MCP->>AWS: Chama searchDocumentation()
    
    Note over User, Web: 6. Web Scraping
    AWS->>Web: HTTP GET Request
    Note right of Web: https://docs.aws.amazon.com/ec2/<br/>latest/developerguide/
    Web-->>AWS: HTML Response
    
    Note over User, Web: 7. Processamento dos Dados
    AWS->>AWS: Parse HTML com Cheerio
    AWS->>AWS: Extrai títulos, URLs, snippets
    AWS->>AWS: Calcula relevance scores
    
    alt Scraping bem-sucedido
        AWS-->>MCP: Dados estruturados
        Note right of MCP: [{<br/>  "title": "Auto Scaling Groups",<br/>  "url": "https://docs.aws.amazon.com/...",<br/>  "snippet": "Auto Scaling Groups help you...",<br/>  "service": "ec2",<br/>  "relevanceScore": 95<br/>}]
    else Scraping falhou
        AWS->>AWS: Log do erro
        AWS-->>MCP: Dados mock
        Note right of MCP: Dados de fallback para<br/>demonstração
    end
    
    Note over User, Web: 8. Formatação da Resposta
    MCP->>MCP: Formata resposta MCP
    MCP-->>Cursor: Tool Response
    Note right of Cursor: {<br/>  "content": [{<br/>    "type": "text",<br/>    "text": "JSON com resultados..."<br/>  }]<br/>}
    
    Note over User, Web: 9. Apresentação ao Usuário
    Cursor->>Cursor: Processa resposta JSON
    Cursor->>User: Exibe resultados formatados
    Note right of User: Lista de links e snippets<br/>sobre auto scaling no EC2
```

## Exemplo de Requisição Real

### Entrada do Usuário
```
"Preciso saber como configurar auto scaling no EC2. Pode me ajudar?"
```

### Processamento Interno
1. **Cursor** identifica que precisa de informações sobre AWS EC2
2. **Cursor** escolhe a ferramenta `search_aws_docs`
3. **MCP Server** recebe a requisição com parâmetros:
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

### Resposta Estruturada
```json
{
  "content": [
    {
      "type": "text",
      "text": "[\n  {\n    \"title\": \"Auto Scaling Groups\",\n    \"url\": \"https://docs.aws.amazon.com/ec2/latest/developerguide/auto-scaling-groups.html\",\n    \"snippet\": \"Auto Scaling Groups help you maintain application availability and allow you to scale your Amazon EC2 capacity up or down automatically according to conditions you define.\",\n    \"service\": \"ec2\",\n    \"relevanceScore\": 95\n  },\n  {\n    \"title\": \"Getting Started with Auto Scaling\",\n    \"url\": \"https://docs.aws.amazon.com/ec2/latest/developerguide/getting-started-with-auto-scaling.html\",\n    \"snippet\": \"This guide helps you get started with Auto Scaling by creating your first Auto Scaling group.\",\n    \"service\": \"ec2\",\n    \"relevanceScore\": 90\n  }\n]"
    }
  ]
}
```

### Apresentação Final
O Cursor formata e apresenta os resultados de forma amigável ao usuário, incluindo links clicáveis e snippets informativos.

## Vantagens desta Arquitetura

1. **Integração Transparente**: O usuário não precisa saber que está usando MCP
2. **Dados Atualizados**: Web scraping garante informações recentes da AWS
3. **Fallback Robusto**: Dados mock garantem funcionamento mesmo com falhas
4. **Resposta Rápida**: Processamento otimizado e timeout controlado
5. **Formato Estruturado**: Dados JSON facilitam processamento pelo Cursor
