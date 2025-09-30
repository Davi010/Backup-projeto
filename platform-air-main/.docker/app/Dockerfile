FROM php:8.4-fpm

COPY app/composer.lock app/composer.json app/var/www/

ARG APP_ENV=local

WORKDIR /app

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
    libgd-dev

RUN apt-get clean && rm -rf /var/lib/apt/lists/*


RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN pecl install xdebug && docker-php-ext-enable xdebug

RUN git config --global --add safe.directory /app

RUN chown -R www-data:www-data /app
RUN chmod -R 775 /app


EXPOSE 9000 9003

ENTRYPOINT ["sh", "-c", "composer install && php-fpm"]