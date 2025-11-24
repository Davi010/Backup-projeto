# 🔗 Guia de Integração Completa - Frontend, Backend e Banco de Dados

## ✅ Status da Integração

### Frontend (React + TypeScript)
- ✅ Conectado à API Laravel
- ✅ Usa dados reais do banco de dados
- ✅ CRUD completo funcionando:
  - ✅ **Criar** equipamentos
  - ✅ **Listar** equipamentos
  - ✅ **Editar** equipamentos
  - ✅ **Deletar** equipamentos

### Backend (Laravel)
- ✅ API RESTful configurada
- ✅ CORS configurado
- ✅ Validações implementadas
- ✅ Tratamento de erros padronizado
- ✅ Relacionamentos entre modelos

### Banco de Dados (MySQL)
- ✅ Configurado e rodando
- ✅ Migrations executadas
- ✅ Relacionamentos configurados

---

## 🚀 Como Iniciar o Projeto Completo

### 1. Verificar se o Docker está rodando
```powershell
docker ps
```

### 2. Iniciar todos os containers
```powershell
cd platform-air-main
docker compose up -d
```

### 3. Aguardar os containers iniciarem (30-60 segundos)
```powershell
docker ps
```
Todos os 5 containers devem estar "Up":
- `db` (MySQL)
- `app` (Laravel/PHP-FPM)
- `web` (React/Vite)
- `phpmyadmin`
- `webserver` (Nginx)

### 4. Verificar se a API está funcionando
```powershell
# Testar endpoint de marcas
Invoke-WebRequest -Uri "http://localhost:8080/api/brand" -Method GET
```

### 5. Acessar o sistema
- **Frontend:** http://localhost:5173
- **API:** http://localhost:8080/api
- **PHPMyAdmin:** http://localhost:8888

---

## 🔧 Configurações Importantes

### Arquivo `.env` do Frontend (`web/.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Arquivo `.env` do Backend (`app/.env`)
```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ac_manege_db
DB_USERNAME=user
DB_PASSWORD=userpass
```

---

## 📋 Fluxo Completo de Funcionamento

### 1. **Criar Equipamento**
1. Acesse http://localhost:5173
2. Clique em "Novo Ar Condicionado"
3. Preencha o formulário:
   - Nome do equipamento
   - Selecione uma marca
   - Selecione um modelo
   - Quantidade
   - Notas (opcional)
4. Clique em "Salvar"
5. O equipamento é salvo no banco de dados
6. A lista é atualizada automaticamente

### 2. **Listar Equipamentos**
- Os equipamentos são carregados automaticamente ao abrir o dashboard
- Dados vêm diretamente do banco de dados MySQL
- Filtros de busca funcionam em tempo real

### 3. **Editar Equipamento**
1. Clique no ícone "⋯" ao lado do equipamento
2. Selecione "Editar"
3. O formulário é preenchido com os dados atuais
4. Modifique os campos desejados
5. Clique em "Salvar"
6. As alterações são salvas no banco de dados
7. A lista é atualizada automaticamente

### 4. **Deletar Equipamento**
1. Clique no ícone "⋯" ao lado do equipamento
2. Selecione "Excluir"
3. Confirme a exclusão
4. O equipamento é removido do banco de dados
5. A lista é atualizada automaticamente

---

## 🐛 Solução de Problemas

### Problema: API retorna 502 Bad Gateway

**Causa:** PHP-FPM não está rodando

**Solução:**
```powershell
# Verificar se o container app está rodando
docker ps | findstr app

# Se não estiver, iniciar
docker compose up -d app

# Verificar logs
docker logs app --tail 20
```

### Problema: Frontend não carrega dados

**Causa:** URL da API incorreta ou CORS bloqueado

**Solução:**
1. Verifique o arquivo `web/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
2. Reinicie o container web:
   ```powershell
   docker compose restart web
   ```

### Problema: Erro de conexão com banco de dados

**Causa:** Banco de dados não está pronto ou configuração incorreta

**Solução:**
1. Verifique se o container db está saudável:
   ```powershell
   docker ps | findstr db
   ```
2. Verifique as configurações no `app/.env`
3. Teste a conexão:
   ```powershell
   docker exec app php artisan tinker
   # Dentro do tinker: DB::connection()->getPdo();
   ```

### Problema: Migrations não executadas

**Solução:**
```powershell
docker exec app php artisan migrate --force
```

---

## ✅ Checklist de Verificação

Após iniciar os containers, verifique:

- [ ] Todos os 5 containers estão rodando (`docker ps`)
- [ ] API responde em http://localhost:8080/api/brand
- [ ] Frontend carrega em http://localhost:5173
- [ ] Frontend consegue listar equipamentos
- [ ] É possível criar um novo equipamento
- [ ] É possível editar um equipamento
- [ ] É possível deletar um equipamento
- [ ] Dados persistem após recarregar a página

---

## 📊 Estrutura de Dados

### Equipamento (Equipment)
- `id`: ID único
- `name`: Nome do equipamento
- `model_id`: ID do modelo
- `quantity`: Quantidade
- `notes`: Notas adicionais
- `created_at`: Data de criação
- `updated_at`: Data de atualização

### Relacionamentos
- Equipment → Model → Brand
- Equipment → Maintenances

---

## 🔄 Atualização Automática

O sistema está configurado para atualizar automaticamente:
- ✅ Após criar equipamento
- ✅ Após editar equipamento
- ✅ Após deletar equipamento
- ✅ Ao voltar do formulário para o dashboard

---

**Sistema totalmente integrado e funcionando! 🎉**

