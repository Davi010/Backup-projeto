FROM php:8.4-fpm

WORKDIR /app

# Instalar apenas pacotes essenciais (sem --no-install-recommends para evitar problemas)
# Separar em camadas para melhor cache do Docker
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libzip-dev \
    libgd-dev \
    zip \
    unzip \
    git \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP básicas (mais rápidas)
RUN docker-php-ext-install -j$(nproc) pdo_mysql mbstring zip exif pcntl

# Configurar e instalar extensão GD (mais lenta, separada para cache)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Limpar cache do apt após instalações
RUN apt-get clean

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Xdebug é opcional e muito lento - comentado para acelerar build
# Descomente apenas se precisar de debug
# RUN pecl install xdebug && docker-php-ext-enable xdebug

# Configurar Git e criar diretórios necessários
RUN git config --global --add safe.directory /app \
    && mkdir -p /var/run/php

# Configurar PHP-FPM para escutar em todas as interfaces
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf || \
    sed -i 's/listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf || \
    echo "listen = 0.0.0.0:9000" >> /usr/local/etc/php-fpm.d/www.conf

# Copiar scripts de configuração (camada que muda raramente)
COPY ./.docker/app/entrypoint.sh /entrypoint.sh
COPY ./.docker/app/php-fpm-custom.conf /usr/local/etc/php-fpm.d/zz-custom.conf
RUN chmod +x /entrypoint.sh

# NOTA: Não copiamos o código aqui nem instalamos dependências
# Isso será feito no entrypoint.sh para aproveitar o volume nomeado
# e evitar rebuilds desnecessários quando o código muda

EXPOSE 9000 9003

# Usar script de entrada
ENTRYPOINT ["/entrypoint.sh"]
