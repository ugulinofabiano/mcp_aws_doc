# Exemplos de Uso do AWS Documentation MCP

Este documento contém exemplos práticos de como usar o servidor MCP para consultar documentações da AWS.

## Exemplo 1: Buscar informações sobre Auto Scaling

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

**Resultado esperado:**
- Documentação sobre Auto Scaling Groups
- Guias de configuração
- Melhores práticas
- Exemplos de uso

## Exemplo 2: Obter documentação completa do AWS Lambda

```json
{
  "name": "get_aws_service_docs",
  "arguments": {
    "serviceName": "lambda"
  }
}
```

**Resultado esperado:**
- Visão geral do serviço
- Principais funcionalidades
- Casos de uso comuns
- Links para documentação completa

## Exemplo 3: Listar serviços de computação

```json
{
  "name": "list_aws_services",
  "arguments": {
    "category": "compute"
  }
}
```

**Resultado esperado:**
- EC2 (Elastic Compute Cloud)
- Lambda
- ECS (Elastic Container Service)
- EKS (Elastic Kubernetes Service)
- Fargate

## Exemplo 4: Consultar preços do S3

```json
{
  "name": "get_aws_pricing_info",
  "arguments": {
    "serviceName": "s3",
    "region": "us-east-1"
  }
}
```

**Resultado esperado:**
- Preços por GB para armazenamento Standard
- Preços para Standard-IA
- Preços para Glacier
- Preços para transferência de dados

## Exemplo 5: Buscar informações sobre segurança

```json
{
  "name": "search_aws_docs",
  "arguments": {
    "query": "security best practices",
    "maxResults": 10
  }
}
```

**Resultado esperado:**
- Guias de segurança
- Configurações de IAM
- Criptografia
- Compliance e auditoria

## Exemplo 6: Documentação específica do RDS

```json
{
  "name": "get_aws_service_docs",
  "arguments": {
    "serviceName": "rds",
    "topic": "backup-restore"
  }
}
```

**Resultado esperado:**
- Informações sobre backup automático
- Processo de restauração
- Pontos de recuperação
- Configurações de retenção

## Casos de Uso Comuns

### 1. Desenvolvedor iniciante
- Listar serviços por categoria
- Obter documentação básica
- Consultar preços para planejamento

### 2. Arquiteto de soluções
- Buscar melhores práticas
- Comparar serviços
- Consultar informações de segurança

### 3. DevOps Engineer
- Buscar guias de configuração
- Consultar informações de monitoramento
- Obter documentação de troubleshooting

### 4. Gerente de projeto
- Consultar preços para orçamento
- Listar serviços relevantes
- Obter visão geral de funcionalidades

## Integração com Claude Desktop

Para usar com o Claude Desktop, adicione a configuração no arquivo `config.json`:

```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "node",
      "args": ["C:\\caminho\\para\\seu\\projeto\\dist\\index.js"],
      "env": {}
    }
  }
}
```

## Troubleshooting

### Erro de conexão
- Verifique se o servidor está rodando
- Confirme o caminho no arquivo de configuração
- Verifique as permissões de execução

### Resultados vazios
- Algumas consultas podem retornar dados mockados
- Verifique a conectividade com a internet
- Considere usar APIs oficiais da AWS para dados em tempo real

### Performance
- Use filtros específicos para reduzir resultados
- Limite o número de resultados com `maxResults`
- Considere cache para consultas frequentes
