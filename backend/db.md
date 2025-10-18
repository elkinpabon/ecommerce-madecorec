docker run -d \
  --name mysql_db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=ecommerce \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0



docker run -d \
  --name phpmyadmin \
  --link mysql_db:db \
  -e PMA_HOST=mysql_db \
  -e PMA_USER=root \
  -e PMA_PASSWORD=root \
  -p 8080:80 \
  phpmyadmin/phpmyadmin:latest



