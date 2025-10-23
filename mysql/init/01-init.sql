-- Script de inicialização do banco de dados
CREATE DATABASE IF NOT EXISTS clinic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário se não existir e garantir privilégios
CREATE USER IF NOT EXISTS 'clinic_user'@'%' IDENTIFIED BY 'clinic_password';
GRANT ALL PRIVILEGES ON clinic_db.* TO 'clinic_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'clinic_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;