# Configuração do AWS Documentation MCP no Cursor AI

## ✅ Configuração Concluída

O servidor MCP AWS Documentation já foi configurado no seu arquivo `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "node",
      "args": ["C:\\Users\\uguli\\ai-lab\\dist\\index.js"],
      "env": {}
    }
  }
}
```

## 🚀 Como Usar no Cursor AI

### 1. Reiniciar o Cursor AI
Após adicionar a configuração, você precisa reiniciar o Cursor AI para que as mudanças tenham efeito.

### 2. Verificar se o MCP está funcionando
No Cursor AI, você pode verificar se o servidor MCP está ativo através do painel de ferramentas ou comandos.

### 3. Ferramentas Disponíveis

Agora você terá acesso às seguintes ferramentas AWS no Cursor AI:

#### 🔍 `search_aws_docs`
Busca na documentação AWS por tópicos específicos.

**Exemplo de uso no chat:**
```
"Busque informações sobre AWS Lambda na documentação oficial"
```

#### 📚 `get_aws_service_docs`
Obtém documentação detalhada de um serviço AWS específico.

**Exemplo de uso no chat:**
```
"Me mostre a documentação completa do Amazon S3"
```

#### 📋 `list_aws_services`
Lista todos os serviços AWS disponíveis.

**Exemplo de uso no chat:**
```
"Liste todos os serviços de computação da AWS"
```

#### 💰 `get_aws_pricing_info`
Consulta informações de preços dos serviços AWS.

**Exemplo de uso no chat:**
```
"Qual o preço do Amazon EC2 na região us-east-1?"
```

## 🔧 Solução de Problemas

### Se o MCP não estiver funcionando:

1. **Verificar se o servidor está compilado:**
   ```bash
   cd C:\Users\uguli\ai-lab
   npm run build
   ```

2. **Verificar se o arquivo existe:**
   ```bash
   ls C:\Users\uguli\ai-lab\dist\index.js
   ```

3. **Testar o servidor manualmente:**
   ```bash
   cd C:\Users\uguli\ai-lab
   node dist/index.js
   ```

4. **Verificar logs do Cursor AI:**
   - Abra o painel de desenvolvedor (Ctrl+Shift+I)
   - Verifique se há erros relacionados ao MCP

### Se você receber erros de permissão:

1. **Verificar se o Node.js está instalado:**
   ```bash
   node --version
   ```

2. **Verificar se o caminho está correto:**
   - Certifique-se de que o caminho `C:\Users\uguli\ai-lab\dist\index.js` está correto
   - Se necessário, ajuste o caminho no arquivo `mcp.json`

## 📝 Exemplos de Uso Prático

### Exemplo 1: Pesquisar sobre Auto Scaling
```
"Busque informações sobre Auto Scaling Groups na documentação da AWS"
```

### Exemplo 2: Consultar preços
```
"Quanto custa usar AWS Lambda para 1 milhão de execuções por mês?"
```

### Exemplo 3: Listar serviços por categoria
```
"Quais são todos os serviços de banco de dados disponíveis na AWS?"
```

### Exemplo 4: Documentação específica
```
"Me mostre a documentação sobre backup e restore do Amazon RDS"
```

## 🎯 Benefícios

Com o MCP AWS Documentation configurado, você pode:

- ✅ Buscar informações atualizadas da documentação AWS
- ✅ Consultar preços em tempo real
- ✅ Obter documentação técnica detalhada
- ✅ Listar serviços por categoria
- ✅ Acessar links diretos para documentação oficial

## 🔄 Atualizações

Para manter o MCP atualizado:

1. **Atualizar dependências:**
   ```bash
   cd C:\Users\uguli\ai-lab
   npm update
   ```

2. **Recompilar:**
   ```bash
   npm run build
   ```

3. **Reiniciar o Cursor AI**

---

**Nota:** O servidor MCP usa dados mockados como fallback quando as APIs reais da AWS não estão disponíveis, garantindo que você sempre tenha acesso às informações básicas.

