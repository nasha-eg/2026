CREATE DATABASE IF NOT EXISTS capital_charcoal;
USE capital_charcoal;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    images JSON NOT NULL,
    category VARCHAR(100) NOT NULL,
    price VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(255) PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    image TEXT NOT NULL,
    date VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(255) PRIMARY KEY,
    url TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(255) PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment_ar TEXT NOT NULL,
    comment_en TEXT NOT NULL,
    avatar TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    msg TEXT NOT NULL,
    date VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    logo TEXT,
    address_ar TEXT,
    address_en TEXT,
    heroTitle_ar TEXT,
    heroTitle_en TEXT,
    heroSub_ar TEXT,
    heroSub_en TEXT,
    heroImage TEXT
);
    heroImage TEXT
    );
        heroImage TEXT
        );
