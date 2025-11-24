FROM php:8.4-fpm

WORKDIR /app

COPY app/composer.json /app/
COPY app/composer.lock /app/

RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    libzip-dev \
    libgd-dev \
    netcat-openbsd

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Copiar primeiro os arquivos necessários para o composer
COPY app /app

# Instalar dependências do PHP (agora que o artisan existe)
RUN composer install --no-interaction --prefer-dist --no-scripts

RUN git config --global --add safe.directory /app
RUN chown -R www-data:www-data /app
RUN chmod -R 775 /app

EXPOSE 9000 9003

# Copiar script de entrada e configuração customizada do PHP-FPM
COPY ./.docker/app/entrypoint.sh /entrypoint.sh
COPY ./.docker/app/php-fpm-custom.conf /usr/local/etc/php-fpm.d/zz-custom.conf
RUN chmod +x /entrypoint.sh

# Criar diretório de run do PHP-FPM
RUN mkdir -p /var/run/php

# Configurar PHP-FPM para escutar em todas as interfaces (no build)
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf || \
    sed -i 's/listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf || \
    echo "listen = 0.0.0.0:9000" >> /usr/local/etc/php-fpm.d/www.conf

# Usar script de entrada
ENTRYPOINT ["/entrypoint.sh"]
