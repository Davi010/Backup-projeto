#!/bin/sh

# Aguardar o container web estar pronto
echo "Aguardando container web estar disponível..."
until nc -z web 5173; do
  echo "Container web ainda não está pronto. Aguardando..."
  sleep 2
done

echo "Container web está pronto! Iniciando Nginx..."

# Testar configuração do Nginx
nginx -t

# Iniciar Nginx
exec nginx -g "daemon off;"
