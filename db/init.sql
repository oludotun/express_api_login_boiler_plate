-- Delete existing database and create a new one
DROP DATABASE IF EXISTS db_name;
CREATE DATABASE IF NOT EXISTS db_name;
USE db_name;

-- Drop all tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sessions;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX (email),
    PRIMARY KEY (id)
);