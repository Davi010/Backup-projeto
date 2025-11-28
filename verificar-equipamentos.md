# 🔍 Como Verificar se os Ar-Condicionados Estão Cadastrados

## 📋 Métodos para Verificar

### 1️⃣ **Via PHPMyAdmin (Mais Fácil - Interface Gráfica)**

1. Acesse: **http://localhost:8888**
2. Faça login:
   - **Servidor:** `db`
   - **Usuário:** `root`
   - **Senha:** `root`
3. No menu lateral, clique no banco de dados: `ac_manege_db`
4. Clique na tabela: `equipment`
5. Clique na aba **"Procurar"** para ver todos os registros

**Você verá:**
- `id` - ID do equipamento
- `name` - Nome do equipamento
- `model_id` - ID do modelo
- `quantity` - Quantidade
- `btus` - BTUs
- `status` - Status (funcionando, manutencao, defeito, desativado)
- `notes` - Observações
- `created_at` - Data de criação
- `updated_at` - Data de atualização

---

### 2️⃣ **Via API (Testar no Navegador ou Postman)**

#### Ver todos os equipamentos:
```
http://localhost:8080/api/equipment
```

#### Ver um equipamento específico (substitua {id} pelo ID):
```
http://localhost:8080/api/equipment/{id}
```

#### Testar via PowerShell:
```powershell
# Ver todos os equipamentos
Invoke-WebRequest -Uri "http://localhost:8080/api/equipment" -Method GET | Select-Object -ExpandProperty Content

# Ver um equipamento específico (exemplo: ID 1)
Invoke-WebRequest -Uri "http://localhost:8080/api/equipment/1" -Method GET | Select-Object -ExpandProperty Content
```

---

### 3️⃣ **Via Laravel Tinker (Terminal Interativo)**

```powershell
# Acessar o Tinker
docker exec -it app php artisan tinker

# Dentro do Tinker, execute:
```

```php
// Ver todos os equipamentos
App\Models\Equipment::all();

// Contar quantos equipamentos existem
App\Models\Equipment::count();

// Ver um equipamento específico
App\Models\Equipment::find(1);

// Ver equipamentos com seus modelos e marcas
App\Models\Equipment::with('model.brand')->get();

// Ver os últimos 5 equipamentos cadastrados
App\Models\Equipment::latest()->take(5)->get();

// Ver equipamentos por status
App\Models\Equipment::where('status', 'funcionando')->get();

// Sair do Tinker
exit
```

---

### 4️⃣ **Via Comandos Artisan (Linha de Comando)**

```powershell
# Ver todos os equipamentos (formato JSON)
docker exec app php artisan tinker --execute="echo json_encode(App\Models\Equipment::all()->toArray(), JSON_PRETTY_PRINT);"

# Contar equipamentos
docker exec app php artisan tinker --execute="echo App\Models\Equipment::count();"

# Ver último equipamento cadastrado
docker exec app php artisan tinker --execute="echo json_encode(App\Models\Equipment::latest()->first()->toArray(), JSON_PRETTY_PRINT);"
```

---

### 5️⃣ **Via SQL Direto (MySQL)**

```powershell
# Acessar o MySQL
docker exec -it db mysql -uroot -proot ac_manege_db

# Dentro do MySQL, execute:
```

```sql
-- Ver todos os equipamentos
SELECT * FROM equipment;

-- Contar equipamentos
SELECT COUNT(*) as total FROM equipment;

-- Ver equipamentos com informações do modelo
SELECT 
    e.id,
    e.name,
    e.quantity,
    e.btus,
    e.status,
    m.name as model_name,
    b.name as brand_name
FROM equipment e
JOIN models m ON e.model_id = m.id
JOIN brands b ON m.brand_id = b.id
ORDER BY e.created_at DESC;

-- Ver últimos 5 equipamentos cadastrados
SELECT * FROM equipment ORDER BY created_at DESC LIMIT 5;

-- Sair do MySQL
exit;
```

---

## 🎯 Verificação Rápida (Recomendado)

### Opção 1: PHPMyAdmin (Mais Visual)
1. Acesse: http://localhost:8888
2. Login: `root` / `root`
3. Banco: `ac_manege_db`
4. Tabela: `equipment`
5. Aba: **"Procurar"**

### Opção 2: API (Mais Rápido)
Abra no navegador: **http://localhost:8080/api/equipment**

Você verá um JSON com todos os equipamentos cadastrados.

---

## 📊 Estrutura da Tabela `equipment`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único do equipamento |
| `name` | VARCHAR | Nome do equipamento |
| `model_id` | INT | ID do modelo (FK para tabela `models`) |
| `quantity` | INT | Quantidade de unidades |
| `btus` | INT | Potência em BTUs |
| `status` | ENUM | Status: funcionando, manutencao, defeito, desativado |
| `notes` | TEXT | Observações/notas |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

---

## ✅ Checklist de Verificação

- [ ] PHPMyAdmin acessível em http://localhost:8888
- [ ] API respondendo em http://localhost:8080/api/equipment
- [ ] Tabela `equipment` existe no banco `ac_manege_db`
- [ ] Ao cadastrar um equipamento, ele aparece na lista
- [ ] Os dados estão sendo salvos corretamente

---

## 🐛 Se Não Estiver Cadastrando

1. **Verificar logs do Laravel:**
   ```powershell
   docker logs app --tail 100
   ```

2. **Verificar logs do banco de dados:**
   ```powershell
   docker logs db --tail 50
   ```

3. **Verificar se há erros na API:**
   - Abra o console do navegador (F12)
   - Tente cadastrar um equipamento
   - Veja se há erros na aba "Network" ou "Console"

4. **Testar conexão com banco:**
   ```powershell
   docker exec app php artisan migrate:status
   ```

---

**Dica:** A forma mais fácil é usar o PHPMyAdmin (http://localhost:8888) para visualizar os dados de forma gráfica! 🎯

