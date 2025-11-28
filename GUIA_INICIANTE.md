# 🚀 Guia Completo para Iniciantes - AC Manager

Este guia vai te ajudar a configurar e rodar o sistema do zero, sem erros.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- ✅ **Docker Desktop** (Windows/Mac) ou **Docker + Docker Compose** (Linux)
- ✅ **Git** (opcional, apenas se for clonar do repositório)
- ✅ **Terminal/PowerShell** (já vem com Windows)

### Verificar se o Docker está instalado:

```powershell
docker --version
docker compose version
```

Se aparecer a versão, está tudo certo! Se não, baixe em: https://www.docker.com/products/docker-desktop

---

## 📁 Passo 1: Abrir o Projeto

1. Navegue até a pasta do projeto:
   ```powershell
   cd "C:\Users\Davi2004\Downloads\Backup-projeto-Test\Backup-projeto-Test\platform-air-main"
   ```

2. Verifique se o arquivo `docker-compose.yml` existe:
   ```powershell
   Test-Path docker-compose.yml
   ```
   Deve retornar `True`.

---

## 🐳 Passo 2: Iniciar os Containers Docker

### 2.1. Verificar se o Docker está rodando

```powershell
docker ps
```

Se aparecer uma lista (mesmo que vazia), o Docker está funcionando.

### 2.2. Construir e iniciar os containers

```powershell
docker compose up -d --build
```

**⏱️ Isso pode demorar 5-15 minutos na primeira vez** (baixando imagens e compilando).

**O que está acontecendo:**
- Baixando imagens do Docker (MySQL, PHP, Node.js, Nginx)
- Instalando dependências do PHP (Composer)
- Instalando dependências do React (npm)
- Configurando os containers

**Aguarde até ver mensagens como:**
```
✓ Container app started
✓ Container web started
✓ Container webserver started
```

---

## ⏳ Passo 3: Aguardar os Containers Iniciarem

Aguarde **2-3 minutos** após o comando anterior para todos os containers estarem prontos.

### Verificar se todos estão rodando:

```powershell
docker ps
```

Você deve ver **5 containers** rodando:
- ✅ `db` (MySQL)
- ✅ `app` (Laravel/PHP)
- ✅ `web` (React)
- ✅ `phpmyadmin`
- ✅ `webserver` (Nginx)

Se algum não estiver rodando, aguarde mais um pouco e verifique novamente.

---

## ⚙️ Passo 4: Configurar o Laravel

Execute o script de configuração automática:

```powershell
powershell -ExecutionPolicy Bypass -File configurar-laravel.ps1
```

**O que este script faz:**
- ✅ Cria o arquivo `.env` (configurações do Laravel)
- ✅ Gera a chave da aplicação
- ✅ Limpa os caches
- ✅ Verifica conexão com banco de dados
- ✅ Executa as migrations (cria as tabelas)
- ✅ Ajusta permissões

**Tempo estimado:** 1-2 minutos

---

## ✅ Passo 5: Verificar se Está Funcionando

### 5.1. Verificar containers

```powershell
docker ps
```

Todos os 5 containers devem estar com status "Up".

### 5.2. Testar a API

Abra no navegador:
- **API de Marcas:** http://localhost:8080/api/brand
- **API de Modelos:** http://localhost:8080/api/model
- **API de Equipamentos:** http://localhost:8080/api/equipment

**Resultado esperado:** Você deve ver um JSON com `{"status":"success","data":[]}` ou uma lista de dados.

### 5.3. Testar o Frontend

Abra no navegador:
- **Frontend:** http://localhost:5173

**Resultado esperado:** Você deve ver a interface do sistema de gerenciamento de ar-condicionados.

### 5.4. Testar o PHPMyAdmin

Abra no navegador:
- **PHPMyAdmin:** http://localhost:8888

**Login:**
- Servidor: `db`
- Usuário: `root`
- Senha: `root`

**Resultado esperado:** Você deve ver o banco de dados `ac_manege_db` com as tabelas criadas.

---

## 🎯 URLs do Sistema

Após configurar, você terá acesso a:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface do sistema |
| **API Backend** | http://localhost:8080/api | API REST do Laravel |
| **PHPMyAdmin** | http://localhost:8888 | Gerenciador de banco de dados |
| **MySQL** | localhost:3307 | Banco de dados (porta externa) |

---

## 🐛 Solução de Problemas Comuns

### ❌ Erro: "Docker não está rodando"

**Solução:**
1. Abra o Docker Desktop
2. Aguarde até aparecer "Docker Desktop is running"
3. Tente novamente

---

### ❌ Erro: "Port already in use"

**Causa:** Alguma porta (8080, 5173, 8888, 3307) já está em uso.

**Solução:**
1. Pare os containers: `docker compose down`
2. Verifique o que está usando a porta:
   ```powershell
   netstat -ano | findstr :8080
   ```
3. Feche o programa que está usando a porta ou altere a porta no `docker-compose.yml`

---

### ❌ Erro: "502 Bad Gateway" no navegador

**Causa:** PHP-FPM não está rodando ou não está configurado corretamente.

**Solução:**
1. Verifique se o container `app` está rodando:
   ```powershell
   docker ps | findstr app
   ```
2. Veja os logs do container:
   ```powershell
   docker logs app --tail 50
   ```
3. Reinicie o container:
   ```powershell
   docker compose restart app
   ```
4. Execute novamente o script de configuração:
   ```powershell
   powershell -ExecutionPolicy Bypass -File configurar-laravel.ps1
   ```

---

### ❌ Erro: "500 Internal Server Error" na API

**Causa:** Laravel não está configurado corretamente.

**Solução:**
1. Execute o script de configuração:
   ```powershell
   powershell -ExecutionPolicy Bypass -File configurar-laravel.ps1
   ```
2. Verifique os logs:
   ```powershell
   docker logs app --tail 100
   ```
3. Verifique se o arquivo `.env` existe:
   ```powershell
   Test-Path app\.env
   ```

---

### ❌ Erro: "Connection refused" ou "Could not connect to database"

**Causa:** Banco de dados não está pronto ou configuração incorreta.

**Solução:**
1. Aguarde mais alguns minutos (MySQL demora para inicializar)
2. Verifique se o container `db` está saudável:
   ```powershell
   docker ps | findstr db
   ```
   Deve mostrar status "healthy"
3. Verifique os logs:
   ```powershell
   docker logs db --tail 50
   ```

---

### ❌ Frontend não carrega (tela em branco)

**Causa:** Container `web` não está rodando ou há erro no React.

**Solução:**
1. Verifique se o container está rodando:
   ```powershell
   docker ps | findstr web
   ```
2. Veja os logs:
   ```powershell
   docker logs web --tail 50
   ```
3. Reinicie o container:
   ```powershell
   docker compose restart web
   ```

---

## 📝 Comandos Úteis

### Ver logs dos containers

```powershell
# Logs do Laravel
docker logs app --tail 50

# Logs do React
docker logs web --tail 50

# Logs do Nginx
docker logs webserver --tail 50

# Logs do MySQL
docker logs db --tail 50
```

### Parar os containers

```powershell
docker compose down
```

### Parar e remover volumes (limpar tudo)

```powershell
docker compose down -v
```

**⚠️ Atenção:** Isso apaga todos os dados do banco de dados!

### Reiniciar containers

```powershell
docker compose restart
```

### Reconstruir containers (se houver mudanças)

```powershell
docker compose up -d --build
```

### Acessar o container do Laravel

```powershell
docker exec -it app sh
```

### Executar comandos Artisan

```powershell
# Limpar cache
docker exec app php artisan config:clear
docker exec app php artisan cache:clear

# Ver status das migrations
docker exec app php artisan migrate:status

# Executar migrations
docker exec app php artisan migrate --force
```

---

## ✅ Checklist Final

Antes de considerar que está tudo funcionando, verifique:

- [ ] Docker Desktop está rodando
- [ ] Todos os 5 containers estão "Up"
- [ ] API responde em http://localhost:8080/api/brand
- [ ] Frontend carrega em http://localhost:5173
- [ ] PHPMyAdmin acessível em http://localhost:8888
- [ ] É possível cadastrar um ar-condicionado no sistema
- [ ] Os dados aparecem no PHPMyAdmin

---

## 🎓 Próximos Passos

Após o sistema estar funcionando:

1. **Cadastre algumas marcas:**
   - Acesse http://localhost:5173
   - Vá em "Marcas" e cadastre (ex: Samsung, LG, Daikin)

2. **Cadastre alguns modelos:**
   - Vá em "Modelos" e cadastre modelos relacionados às marcas

3. **Cadastre equipamentos:**
   - Vá em "Ar Condicionados" e cadastre equipamentos

4. **Verifique no banco:**
   - Acesse http://localhost:8888
   - Veja os dados na tabela `equipment`

---

## 📚 Estrutura do Projeto

```
platform-air-main/
├── app/                    # Backend Laravel
│   ├── .env               # Configurações (criado automaticamente)
│   ├── app/               # Código da aplicação
│   ├── database/          # Migrations e seeders
│   └── routes/            # Rotas da API
├── web/                   # Frontend React + TypeScript
│   ├── src/              # Código fonte
│   └── package.json      # Dependências
├── .docker/              # Configurações Docker
│   ├── app/              # Dockerfile do Laravel
│   ├── web/              # Dockerfile do React
│   └── nginx/            # Configuração do Nginx
├── docker-compose.yml     # Orquestração dos containers
└── configurar-laravel.ps1 # Script de configuração automática
```

---

## 🆘 Precisa de Ajuda?

Se ainda tiver problemas:

1. **Verifique os logs:**
   ```powershell
   docker logs app --tail 100
   docker logs web --tail 100
   docker logs webserver --tail 100
   ```

2. **Reconstrua tudo do zero:**
   ```powershell
   docker compose down -v
   docker compose up -d --build
   ```
   Aguarde 5-10 minutos e execute novamente:
   ```powershell
   powershell -ExecutionPolicy Bypass -File configurar-laravel.ps1
   ```

3. **Verifique se as portas estão livres:**
   - 8080 (API)
   - 5173 (Frontend)
   - 8888 (PHPMyAdmin)
   - 3307 (MySQL)

---

## 🎉 Pronto!

Se você chegou até aqui e tudo está funcionando, parabéns! 🎊

O sistema está configurado e pronto para uso. Você pode começar a cadastrar ar-condicionados e gerenciá-los através da interface web.

**Dúvidas?** Consulte os outros arquivos de documentação:
- `verificar-equipamentos.md` - Como verificar dados no banco
- `SOLUCAO_PROBLEMAS.md` - Soluções para problemas específicos

---

**Última atualização:** Novembro 2025

