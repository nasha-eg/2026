<?php
header("Content-Type: text/html; charset=UTF-8");

$config_file = 'config.php';

if (!file_exists($config_file)) {
    die("خطأ: ملف config.php غير موجود. يرجى إنشاؤه أولاً.");
}

require_once $config_file;

echo "<h2>جاري تثبيت قاعدة بيانات فحم العاصمة...</h2>";

try {
    // SQL commands from schema.sql
    $sql = "
    CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name_ar TEXT,
        name_en TEXT,
        description_ar TEXT,
        description_en TEXT,
        images LONGTEXT,
        category VARCHAR(100),
        price VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(255) PRIMARY KEY,
        title_ar TEXT,
        title_en TEXT,
        content_ar TEXT,
        content_en TEXT,
        image TEXT,
        date VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS gallery (
        id VARCHAR(255) PRIMARY KEY,
        url TEXT,
        title_ar TEXT,
        title_en TEXT,
        category VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        author VARCHAR(255),
        rating INT,
        comment_ar TEXT,
        comment_en TEXT,
        avatar TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        msg TEXT,
        date VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT INTO settings (id, phone, whatsapp, logo, address_ar, address_en, heroTitle_ar, heroTitle_en, heroSub_ar, heroSub_en, heroImage)
    SELECT 1, '01000187892', '201000187892', '', 'دمياط الجديدة', 'New Damietta', 'فحم العاصمة', 'Capital Charcoal', 'جودة لا تضاهى', 'Unmatched Quality', ''
    FROM DUAL
    WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);
    ";

    $conn->exec($sql);
    echo "<p style='color: green;'>✅ تم إنشاء الجداول وتثبيت قاعدة البيانات بنجاح!</p>";
    echo "<p>يمكنك الآن البدء في استخدام لوحة الإدارة.</p>";
    echo "<br><a href='../'>العودة للموقع</a>";

} catch(PDOException $e) {
    echo "<p style='color: red;'>❌ فشل التثبيت: " . $e->getMessage() . "</p>";
}
?>
