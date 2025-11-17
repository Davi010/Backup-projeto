# 🔧 Correções Aplicadas - Problemas Docker

## Problemas Identificados e Corrigidos

### 1. ❌ Erro: `host not found in upstream "web:5173"`

**Causa:** O Nginx tentava resolver o hostname `web:5173` no momento da inicialização, mas o container `web` ainda não estava pronto.

**Solução Aplicada:**
- ✅ Criado `entrypoint.sh` que aguarda o container `web` estar disponível antes de iniciar o Nginx
- ✅ Configurado resolver DNS dinâmico no Nginx usando variáveis
- ✅ Adicionado `depends_on` com condições no `docker-compose.yml`
- ✅ Instalado `netcat-openbsd` no container Nginx para verificar conectividade

### 2. ❌ Erro: `Access denied for user 'root'@'localhost'`

**Causa:** O healthcheck do MySQL não estava passando as credenciais corretas.

**Solução Aplicada:**
- ✅ Corrigido healthcheck para usar `-uroot -proot`
- ✅ Adicionado interval, timeout, retries e start_period ao healthcheck

---

## 🚀 Como Reiniciar os Containers

### Opção 1: Reiniciar tudo (Recomendado)

```powershell
# Parar e remover containers
docker compose down

# Reconstruir e iniciar
docker compose up -d --build
```

### Opção 2: Apenas reconstruir o Nginx

```powershell
# Parar apenas o Nginx
docker compose stop nginx

# Reconstruir e iniciar
docker compose up -d --build nginx
```

### Opção 3: Verificar logs se ainda houver problemas

```powershell
# Ver logs do Nginx
docker logs webserver

# Ver logs do container web
docker logs web

# Ver logs do MySQL
docker logs db
```

---

## ✅ Verificação Pós-Correção

Após reiniciar, verifique:

1. **Todos os containers estão rodando:**
   ```powershell
   docker ps
   ```
   Deve mostrar 5 containers: `db`, `app`, `web`, `phpmyadmin`, `webserver`

2. **Nginx está funcionando:**
   ```powershell
   docker logs webserver
   ```
   Deve mostrar: "Container web está pronto! Iniciando Nginx..."

3. **MySQL está saudável:**
   ```powershell
   docker exec db mysqladmin ping -h localhost -uroot -proot
   ```
   Deve retornar: `mysqld is alive`

4. **Container web está respondendo:**
   ```powershell
   docker exec web curl -s http://localhost:5173 | head -n 5
   ```

---

## 📝 Arquivos Modificados

1. **`.docker/nginx/nginx.conf`**
   - Removido upstream estático para `react_upstream`
   - Adicionado resolver DNS dinâmico
   - Configurado proxy_pass com variável para resolução em runtime

2. **`.docker/nginx/entrypoint.sh`** (NOVO)
   - Script que aguarda container `web` estar pronto
   - Verifica conectividade na porta 5173 antes de iniciar Nginx

3. **`docker-compose.yml`**
   - Corrigido healthcheck do MySQL com credenciais
   - Adicionado `depends_on` com condições para Nginx
   - Adicionado `web_node_modules` volume

4. **`.docker/nginx/Dockerfile`**
   - Já tinha `netcat-openbsd` instalado (necessário para entrypoint.sh)

---

## 🐛 Se Ainda Houver Problemas

### Problema: Nginx ainda não encontra o container web

**Solução:**
1. Verifique se o container `web` está rodando:
   ```powershell
   docker ps | findstr web
   ```

2. Verifique se o container `web` está na mesma rede:
   ```powershell
   docker network inspect platform-air-main_app-network
   ```

3. Teste conectividade manualmente:
   ```powershell
   docker exec webserver nc -z web 5173
   ```

### Problema: MySQL ainda com erro de acesso

**Solução:**
1. Verifique se o volume do MySQL está limpo (CUIDADO: apaga dados):
   ```powershell
   docker compose down -v
   docker volume rm platform-air-main_dbdata
   docker compose up -d --build
   ```

2. Verifique as variáveis de ambiente:
   ```powershell
   docker exec db env | findstr MYSQL
   ```

---

## 📚 Referências

- [Docker Compose depends_on](https://docs.docker.com/compose/compose-file/compose-file-v3/#depends_on)
- [Nginx Dynamic Upstream](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Docker Healthcheck](https://docs.docker.com/engine/reference/builder/#healthcheck)

---

**Após aplicar as correções, reinicie os containers e verifique os logs!** 🚀

