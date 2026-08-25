FROM php:8.3-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libcurl4-openssl-dev unzip \
    && docker-php-ext-install pdo_pgsql curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /backend

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts

COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["sh", "-c", "php artisan config:clear && php artisan db:seed --force && php artisan route:clear && php artisan migrate --force && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=8000"]