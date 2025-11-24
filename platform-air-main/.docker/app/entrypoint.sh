#!/bin/sh

# Aguardar o banco de dados estar pronto
echo "Aguardando banco de dados..."
until nc -z db 3306; do
  echo "Banco de dados ainda não está pronto. Aguardando..."
  sleep 2
done

echo "Banco de dados está pronto!"

# Instalar dependências se necessário
if [ ! -d "/app/vendor" ]; then
  echo "Instalando dependências do Composer..."
  composer install --no-interaction --prefer-dist --no-scripts
fi

# Executar scripts do composer que precisam do artisan
composer dump-autoload --optimize

# Criar diretório de run do PHP-FPM
mkdir -p /var/run/php

# Configurar PHP-FPM para escutar em todas as interfaces
echo "Configurando PHP-FPM para escutar em 0.0.0.0:9000..."
# Sobrescrever a configuração listen no www.conf
sed -i 's/^listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf
# Se não encontrou, adicionar após [www]
if ! grep -q "listen = 0.0.0.0:9000" /usr/local/etc/php-fpm.d/www.conf; then
  sed -i '/^\[www\]/a listen = 0.0.0.0:9000' /usr/local/etc/php-fpm.d/www.conf
fi
# Verificar configuração
if grep -q "listen = 0.0.0.0:9000" /usr/local/etc/php-fpm.d/www.conf || grep -q "listen = 0.0.0.0:9000" /usr/local/etc/php-fpm.d/zz-custom.conf; then
  echo "✓ PHP-FPM configurado para escutar em 0.0.0.0:9000"
else
  echo "⚠ Aviso: Verificando configuração alternativa..."
fi

# Ajustar permissões
chown -R www-data:www-data /app
chmod -R 775 /app

# Parar qualquer processo PHP-FPM existente
echo "Parando processos PHP-FPM existentes..."
pkill -f php-fpm || true
sleep 2

# Configurar PHP-FPM para escutar em todas as interfaces (garantir)
sed -i 's/^listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Verificar configuração final
echo "Verificando configuração do PHP-FPM..."
grep -E '^listen' /usr/local/etc/php-fpm.d/www.conf || echo "listen = 0.0.0.0:9000" >> /usr/local/etc/php-fpm.d/www.conf

echo "Iniciando PHP-FPM em 0.0.0.0:9000..."
exec php-fpm -F

