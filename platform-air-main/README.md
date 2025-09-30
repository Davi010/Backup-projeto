# ❄️ AC Manager - Sistema de Gestão de Limpeza e Manutenção de Ar-Condicionado

**AC Manager** (Air Conditioner Manager) é um sistema de **gestão e automação de processos de manutenção preventiva e corretiva de ar-condicionado**, voltado para instituições de médio e grande porte, como universidades e centros educacionais.  

O projeto busca resolver problemas recorrentes como:
- Falta de padronização no registro das informações dos equipamentos;  
- Esquecimento ou atraso em manutenções preventivas, gerando falhas e custos elevados;  
- Dificuldade no acompanhamento do histórico de serviços;  
- Falta de integração entre equipes internas e empresas terceirizadas;  
- Riscos à saúde devido à má qualidade do ar causada por manutenção inadequada.  


---

# 🚀 Guia de Instalação e Execução do Projeto

## Pré-requisitos
- Docker instalado  
- Docker Compose instalado  

---

## Passo a passo

### 1. Clone o repositório
```bash
git clone https://seu-repo-aqui.git
cd nome-do-projeto
```

### 2. Configure as variaveis ambientes
<p>Copie o .env.exemple dentro de app e renomei para .env</p>

<p>Ou se preferir pode rodar o seguinte comando:</p>

```bash
git clone https://seu-repo-aqui.git
cd nome-do-projeto
```

### 3. Subindo os containers
```bash
docker compose up -d --build
```

### 4. Ajustando as permissão
```bash
docker exec -u root app sh -c "chown -R www-data:www-data /app && chmod -R 775 /app"
```

### 5. Execute as migrations
```bash
docker exec -u root app sh -c "php artisan migrate"
```

---

## Pré-requisitos
- APP (Laravel) → http://localhost:8080
- WEB (React com Vite) → http://localhost:5173
- PHPMyAdmin → http://localhost:8888


