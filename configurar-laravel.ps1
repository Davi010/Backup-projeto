# Script para configurar o Laravel e corrigir erros 500
# Execute: .\configurar-laravel.ps1

Write-Host "Configurando Laravel..." -ForegroundColor Cyan

# Verificar se o container app está rodando
Write-Host "`nVerificando container app..." -ForegroundColor Yellow
$appRunning = docker ps --filter "name=app" --format "{{.Names}}"
if (-not $appRunning) {
    Write-Host "ERRO: Container 'app' nao esta rodando!" -ForegroundColor Red
    Write-Host "Execute: docker compose up -d" -ForegroundColor Yellow
    exit 1
}
Write-Host "OK: Container app esta rodando" -ForegroundColor Green

# Criar arquivo .env se não existir
Write-Host "`nVerificando arquivo .env..." -ForegroundColor Yellow
$envPath = "app\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Criando arquivo .env..." -ForegroundColor Yellow
    
    $envContent = @"
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8080

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ac_manege_db
DB_USERNAME=user
DB_PASSWORD=userpass

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
"@
    
    Set-Content -Path $envPath -Value $envContent
    Write-Host "OK: Arquivo .env criado" -ForegroundColor Green
} else {
    Write-Host "OK: Arquivo .env ja existe" -ForegroundColor Green
}

# Copiar .env para o container
Write-Host "`nCopiando .env para o container..." -ForegroundColor Yellow
docker cp $envPath app:/app/.env
Write-Host "OK: .env copiado para o container" -ForegroundColor Green

# Gerar chave da aplicação
Write-Host "`nGerando chave da aplicacao..." -ForegroundColor Yellow
docker exec -u root app sh -c "php artisan key:generate" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Chave da aplicacao gerada" -ForegroundColor Green
} else {
    Write-Host "AVISO: Aviso ao gerar chave (pode ja estar gerada)" -ForegroundColor Yellow
}

# Limpar caches
Write-Host "`nLimpando caches..." -ForegroundColor Yellow
docker exec -u root app sh -c "php artisan config:clear" 2>&1 | Out-Null
docker exec -u root app sh -c "php artisan cache:clear" 2>&1 | Out-Null
docker exec -u root app sh -c "php artisan route:clear" 2>&1 | Out-Null
docker exec -u root app sh -c "php artisan view:clear" 2>&1 | Out-Null
Write-Host "OK: Caches limpos" -ForegroundColor Green

# Verificar conexão com banco de dados
Write-Host "`nVerificando conexao com banco de dados..." -ForegroundColor Yellow
$dbCheck = docker exec app sh -c "php artisan migrate:status" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Conexao com banco de dados OK" -ForegroundColor Green
} else {
    Write-Host "AVISO: Nao foi possivel verificar conexao (banco pode estar inicializando)" -ForegroundColor Yellow
}

# Executar migrations
Write-Host "`nExecutando migrations..." -ForegroundColor Yellow
docker exec -u root app sh -c "php artisan migrate --force" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Migrations executadas" -ForegroundColor Green
} else {
    Write-Host "AVISO: Erro ao executar migrations (verifique os logs)" -ForegroundColor Yellow
}

# Ajustar permissões
Write-Host "`nAjustando permissoes..." -ForegroundColor Yellow
docker exec -u root app sh -c "chown -R www-data:www-data /app && chmod -R 775 /app" 2>&1 | Out-Null
Write-Host "OK: Permissoes ajustadas" -ForegroundColor Green

Write-Host "`nConfiguracao concluida!" -ForegroundColor Green
Write-Host "`nProximos passos:" -ForegroundColor Cyan
Write-Host "   1. Teste a API: http://localhost:8080/api/brand" -ForegroundColor White
Write-Host "   2. Verifique os logs: docker logs app --tail 50" -ForegroundColor White
Write-Host "   3. Se ainda houver erros, verifique: docker exec app sh -c 'php artisan config:cache'" -ForegroundColor White

