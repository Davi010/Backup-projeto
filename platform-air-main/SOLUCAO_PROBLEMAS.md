# 🔧 Solução de Problemas - AC Manager

## ❌ Erro: "host not found in upstream 'web:5173'"

### Problema
O Nginx está tentando se conectar ao container `web` antes dele estar pronto.

### ✅ Solução Implementada
1. Adicionado `depends_on: web` no serviço nginx
2. Criado script de inicialização (`entrypoint.sh`) que aguarda o container web estar pronto
3. Instalado `netcat-openbsd` no container nginx para verificar conectividade

---

## ❌ Erro: "Cannot find module '@rollup/rollup-linux-x64-gnu'"

### Problema
O Rollup precisa de binários nativos específicos da plataforma Linux, mas o `node_modules` do Windows está sendo copiado para o container.

### ✅ Soluções

#### Solução 1: Reconstruir o container web (Recomendado)
```powershell
docker compose stop web
docker compose build --no-cache web
docker compose up -d web
```

#### Solução 2: Instalar dependências dentro do container
```powershell
docker exec -it web sh
cd /app
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps --force
npm install --save-dev @rollup/rollup-linux-x64-gnu
exit
docker compose restart web
```

#### Solução 3: Usar volume nomeado para node_modules (Melhor prática)
Adicione ao `docker-compose.yml` no serviço `web`:
```yaml
volumes:
  - ./web:/app
  - web_node_modules:/app/node_modules  # Volume separado para node_modules
```

E adicione no final do arquivo:
```yaml
volumes:
  web_node_modules:
```

---

## ❌ Erro: "APPLICATION IN PRODUCTION"

### Problema
Arquivo `.env` não existe ou `APP_ENV=production`.

### ✅ Solução
1. Verificar se o arquivo `.env` existe em `app/.env`
2. Garantir que contém `APP_ENV=local`
3. Executar: `docker exec -u root app sh -c "php artisan config:clear"`

---

## ❌ Erro: "Access denied for user 'root'@'localhost'"

### Problema
Tentativa de conexão ao MySQL sem senha ou com credenciais incorretas.

### ✅ Solução
Verificar as credenciais no `.env`:
```
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ac_manege_db
DB_USERNAME=user
DB_PASSWORD=userpass
```

---

## 📋 Checklist de Verificação

### Containers rodando
```powershell
docker ps
```

Deve mostrar:
- ✅ `db` (MySQL) - Status: Up (healthy)
- ✅ `app` (Laravel) - Status: Up
- ✅ `web` (React) - Status: Up
- ✅ `phpmyadmin` - Status: Up
- ✅ `webserver` (Nginx) - Status: Up

### Verificar logs
```powershell
# Logs do React
docker logs web --tail 50

# Logs do Nginx
docker logs webserver --tail 50

# Logs do Laravel
docker logs app --tail 50
```

### Testar conectividade
```powershell
# Verificar se o container web está acessível
docker exec webserver nc -z web 5173

# Verificar se o MySQL está acessível
docker exec app sh -c "php artisan migrate:status"
```

---

## 🚀 Comandos Úteis

### Reconstruir tudo do zero
```powershell
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Reinstalar dependências do frontend
```powershell
docker exec -it web sh -c "cd /app && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps --force"
```

### Limpar cache do Laravel
```powershell
docker exec -u root app sh -c "php artisan config:clear && php artisan cache:clear"
```

### Verificar status das migrations
```powershell
docker exec -u root app sh -c "php artisan migrate:status"
```

---

## 💡 Dicas

1. **Sempre use `--no-cache` ao reconstruir** quando houver problemas com dependências
2. **Aguarde alguns segundos** após iniciar os containers para eles estarem totalmente prontos
3. **Verifique os logs** se algo não estiver funcionando
4. **Use volumes nomeados** para `node_modules` para evitar problemas de sincronização entre Windows e Linux

---

## 📞 Se nada funcionar

1. Pare todos os containers: `docker compose down -v`
2. Remova as imagens: `docker rmi platform-air-main-web platform-air-main-app platform-air-main-nginx`
3. Reconstrua tudo: `docker compose build --no-cache`
4. Inicie: `docker compose up -d`
5. Aguarde 2-3 minutos e verifique os logs

