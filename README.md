# 🏢 AC Manager - Sistema de Gerenciamento de Ar-Condicionados

Sistema completo para gerenciamento de ar-condicionados com backend Laravel e frontend React.

## 🚀 Início Rápido

**Para iniciantes:** Leia primeiro o **[GUIA_INICIANTE.md](./GUIA_INICIANTE.md)** - Guia completo passo a passo.

### Passos Rápidos (Resumo)

1. **Instalar Docker Desktop** (se ainda não tiver)
2. **Abrir o projeto** na pasta `platform-air-main`
3. **Executar:**
   ```powershell
   docker compose up -d --build
   ```
4. **Aguardar 2-3 minutos** para containers iniciarem
5. **Configurar Laravel:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File configurar-laravel.ps1
   ```
6. **Acessar:**
   - Frontend: http://localhost:5173
   - API: http://localhost:8080/api
   - PHPMyAdmin: http://localhost:8888

**📖 Para instruções detalhadas, veja [GUIA_INICIANTE.md](./GUIA_INICIANTE.md)**

---

## 📋 Tecnologias

- **Backend:** Laravel 11 (PHP 8.4)
- **Frontend:** React 18 + TypeScript + Vite
- **Banco de Dados:** MySQL 5.7
- **Servidor Web:** Nginx
- **Containerização:** Docker + Docker Compose

---

## 🎯 Funcionalidades

- ✅ Cadastro de Marcas
- ✅ Cadastro de Modelos
- ✅ Cadastro de Equipamentos (Ar-Condicionados)
- ✅ Gerenciamento de Manutenções
- ✅ Interface moderna e responsiva
- ✅ API RESTful completa

---

## 📁 Estrutura do Projeto

```
platform-air-main/
├── app/                    # Backend Laravel
│   ├── app/               # Código da aplicação
│   ├── database/          # Migrations e seeders
│   └── routes/            # Rotas da API
├── web/                   # Frontend React
│   └── src/              # Código fonte
├── .docker/              # Configurações Docker
└── docker-compose.yml     # Orquestração dos containers
```

---

## 🌐 URLs do Sistema

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface do sistema |
| **API Backend** | http://localhost:8080/api | API REST do Laravel |
| **PHPMyAdmin** | http://localhost:8888 | Gerenciador de banco de dados |

---

## 📚 Documentação

- **[GUIA_INICIANTE.md](./GUIA_INICIANTE.md)** - Guia completo para iniciantes (RECOMENDADO)
- **[verificar-equipamentos.md](./verificar-equipamentos.md)** - Como verificar dados no banco
- **[SOLUCAO_PROBLEMAS.md](./SOLUCAO_PROBLEMAS.md)** - Soluções para problemas comuns

---

## 🛠️ Comandos Úteis

### Iniciar containers
```powershell
docker compose up -d
```

### Parar containers
```powershell
docker compose down
```

### Ver logs
```powershell
docker logs app --tail 50
docker logs web --tail 50
```

### Reconstruir containers
```powershell
docker compose up -d --build
```

### Configurar Laravel
```powershell
powershell -ExecutionPolicy Bypass -File configurar-laravel.ps1
```

---

## 🐛 Problemas?

Consulte o **[GUIA_INICIANTE.md](./GUIA_INICIANTE.md)** na seção "Solução de Problemas Comuns".

---

## 📝 Licença

Este projeto é de uso interno.

---

## 👥 Contribuindo

1. Faça suas alterações
2. Teste localmente
3. Documente mudanças importantes

---

**Última atualização:** Novembro 2025
