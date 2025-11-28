#!/bin/sh

# Aguardar o container app (PHP-FPM) estar pronto
echo "Aguardando container app (PHP-FPM) estar disponível..."
until nc -z app 9000; do
  echo "Container app ainda não está pronto. Aguardando..."
  sleep 2
done
echo "Container app está pronto!"

# Aguardar o container web estar pronto
echo "Aguardando container web estar disponível..."
until nc -z web 5173; do
  echo "Container web ainda não está pronto. Aguardando..."
  sleep 2
done
echo "Container web está pronto!"

echo "Todos os containers estão prontos! Iniciando Nginx..."

# Testar configuração do Nginx
nginx -t

# Iniciar Nginx
exec nginx -g "daemon off;"
