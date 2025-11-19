# 🚀 Guia de Início Rápido - AC Manager

## ⚠️ Erro "APPLICATION IN PRODUCTION"

O erro **"APPLICATION IN PRODUCTION"** ocorre quando:
- O arquivo `.env` não existe ou está mal configurado
- A variável `APP_ENV` está definida como `production`

**Solução:** Criar/configurar o arquivo `.env` com `APP_ENV=local`

---

## 📋 Passo a Passo para Iniciar o Projeto

### 1️⃣ Verificar se o Docker está rodando

```powershell
docker ps
```

### 2️⃣ Navegar para a pasta do projeto

```powershell
cd "platform-air-main"
```

### 3️⃣ Verificar se o arquivo .env existe

```powershell
cd app
Test-Path .env
```

Se retornar `False`, o arquivo não existe e precisa ser criado.

### 4️⃣ Criar o arquivo .env (se não existir)

O arquivo `.env` já foi criado automaticamente, mas se precisar criar manualmente:

```powershell
# Copie o conteúdo do .env.example (se existir) ou crie um novo arquivo
```

### 5️⃣ Subir os containers Docker

```powershell
cd ..
docker compose up -d --build
```

Aguarde alguns minutos para os containers serem construídos e iniciados.

### 6️⃣ Verificar se os containers estão rodando

```powershell
docker ps
```

Você deve ver os containers:
- `db` (MySQL)
- `app` (Laravel)
- `web` (React/Vite)
- `phpmyadmin`
- `webserver` (Nginx)

### 7️⃣ Ajustar permissões (se necessário)

```powershell
docker exec -u root app sh -c "chown -R www-data:www-data /app && chmod -R 775 /app"
```

### 8️⃣ Gerar a chave da aplicação

```powershell
docker exec -u root app sh -c "php artisan key:generate"
```

### 9️⃣ Limpar cache de configuração

```powershell
docker exec -u root app sh -c "php artisan config:clear"
```

### 🔟 Executar as migrations

```powershell
docker exec -u root app sh -c "php artisan migrate --force"
```

**Nota:** A flag `--force` é necessária quando `APP_ENV=production`, mas como configuramos `APP_ENV=local`, você também pode usar:

```powershell
docker exec -u root app sh -c "php artisan migrate"
```

---

## ✅ Verificar se tudo está funcionando

### Backend (Laravel API)
Acesse: **http://localhost:8080/api/brand**

Você deve ver uma resposta JSON com status "success" e dados vazios (se não houver marcas cadastradas).

### Frontend (React)
Acesse: **http://localhost:5173**

Você deve ver a interface do sistema.

### PHPMyAdmin
Acesse: **http://localhost:8888**

- **Servidor:** `db`
- **Usuário:** `root`
- **Senha:** `root`

---

## 🐛 Solução de Problemas

### Erro: "APPLICATION IN PRODUCTION"

**Causa:** Arquivo `.env` não existe ou `APP_ENV=production`

**Solução:**
1. Verifique se o arquivo `.env` existe em `platform-air-main/app/.env`
2. Verifique se contém `APP_ENV=local`
3. Execute: `docker exec -u root app sh -c "php artisan config:clear"`

### Erro: "Table already exists"

**Causa:** Migration duplicada ou tabela já criada

**Solução:**
```powershell
# Verificar status das migrations
docker exec -u root app sh -c "php artisan migrate:status"

# Se necessário, fazer rollback e rodar novamente
docker exec -u root app sh -c "php artisan migrate:rollback"
docker exec -u root app sh -c "php artisan migrate --force"
```

### Erro: "Connection refused" ou "Could not connect to database"

**Causa:** Banco de dados não está pronto ou configuração incorreta

**Solução:**
1. Verifique se o container `db` está rodando: `docker ps`
2. Verifique as configurações no `.env`:
   ```
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=ac_manege_db
   DB_USERNAME=user
   DB_PASSWORD=userpass
   ```
3. Aguarde alguns segundos após subir os containers para o MySQL inicializar

### Frontend não carrega

**Causa:** Container web não está rodando ou porta incorreta

**Solução:**
1. Verifique se o container `web` está rodando: `docker ps`
2. Verifique os logs: `docker logs web`
3. Verifique se a porta 5173 está livre

---

## 📝 Comandos Úteis

### Ver logs dos containers
```powershell
# Logs do Laravel
docker logs app

# Logs do React
docker logs web

# Logs do Nginx
docker logs webserver

# Logs do MySQL
docker logs db
```

### Parar os containers
```powershell
docker compose down
```

### Parar e remover volumes (limpar tudo)
```powershell
docker compose down -v
```

### Reconstruir containers
```powershell
docker compose up -d --build
```

### Acessar o container do Laravel
```powershell
docker exec -it app sh
```

### Executar comandos Artisan
```powershell
docker exec -u root app sh -c "php artisan [comando]"
```

---

## 🎯 URLs do Projeto

- **API Laravel:** http://localhost:8080/api
- **Frontend React:** http://localhost:5173
- **PHPMyAdmin:** http://localhost:8888
- **Health Check:** http://localhost:8080/up

---

## 📚 Estrutura do Projeto

```
platform-air-main/
├── app/              # Backend Laravel
│   ├── .env          # Configurações (criar se não existir)
│   └── ...
├── web/              # Frontend React
│   ├── .env          # Configurações (opcional)
│   └── ...
└── docker-compose.yml
```

---

## ✅ Checklist de Inicialização

- [ ] Docker está instalado e rodando
- [ ] Arquivo `.env` existe em `app/.env`
- [ ] `APP_ENV=local` no `.env`
- [ ] Containers estão rodando (`docker ps`)
- [ ] Chave da aplicação gerada (`php artisan key:generate`)
- [ ] Migrations executadas (`php artisan migrate`)
- [ ] API responde em http://localhost:8080/api/brand
- [ ] Frontend carrega em http://localhost:5173

---

**Pronto! Seu projeto está configurado e funcionando! 🎉**

