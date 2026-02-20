<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method == 'OPTIONS') {
    exit;
}

switch ($action) {
    case 'products':
        if ($method == 'GET') {
            $stmt = $conn->prepare("SELECT * FROM products");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = array_map(function($r) {
                return [
                    "id" => $r['id'],
                    "name" => ["ar" => $r['name_ar'], "en" => $r['name_en']],
                    "description" => ["ar" => $r['description_ar'], "en" => $r['description_en']],
                    "images" => json_decode($r['images']),
                    "category" => $r['category'],
                    "price" => $r['price']
                ];
            }, $rows);
            echo json_encode($result);
        } elseif ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $conn->exec("DELETE FROM products");
            $stmt = $conn->prepare("INSERT INTO products (id, name_ar, name_en, description_ar, description_en, images, category, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($data as $p) {
                $stmt->execute([$p['id'], $p['name']['ar'], $p['name']['en'], $p['description']['ar'], $p['description']['en'], json_encode($p['images']), $p['category'], $p['price']]);
            }
            echo json_encode(["success" => true]);
        }
        break;

    case 'articles':
        if ($method == 'GET') {
            $stmt = $conn->prepare("SELECT * FROM articles");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = array_map(function($r) {
                return [
                    "id" => $r['id'],
                    "title" => ["ar" => $r['title_ar'], "en" => $r['title_en']],
                    "content" => ["ar" => $r['content_ar'], "en" => $r['content_en']],
                    "image" => $r['image'],
                    "date" => $r['date']
                ];
            }, $rows);
            echo json_encode($result);
        } elseif ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $conn->exec("DELETE FROM articles");
            $stmt = $conn->prepare("INSERT INTO articles (id, title_ar, title_en, content_ar, content_en, image, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
            foreach ($data as $a) {
                $stmt->execute([$a['id'], $a['title']['ar'], $a['title']['en'], $a['content']['ar'], $a['content']['en'], $a['image'], $a['date']]);
            }
            echo json_encode(["success" => true]);
        }
        break;

    case 'settings':
        if ($method == 'GET') {
            $stmt = $conn->prepare("SELECT * FROM settings LIMIT 1");
            $stmt->execute();
            $r = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$r) { echo json_encode([]); break; }
            echo json_encode([
                "phone" => $r['phone'],
                "whatsapp" => $r['whatsapp'],
                "logo" => $r['logo'],
                "address" => ["ar" => $r['address_ar'], "en" => $r['address_en']],
                "heroTitle" => ["ar" => $r['heroTitle_ar'], "en" => $r['heroTitle_en']],
                "heroSub" => ["ar" => $r['heroSub_ar'], "en" => $r['heroSub_en']],
                "heroImage" => $r['heroImage']
            ]);
        } elseif ($method == 'POST') {
            $s = json_decode(file_get_contents("php://input"), true);
            $conn->exec("DELETE FROM settings");
            $stmt = $conn->prepare("INSERT INTO settings (phone, whatsapp, logo, address_ar, address_en, heroTitle_ar, heroTitle_en, heroSub_ar, heroSub_en, heroImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$s['phone'], $s['whatsapp'], $s['logo'], $s['address']['ar'], $s['address']['en'], $s['heroTitle']['ar'], $s['heroTitle']['en'], $s['heroSub']['ar'], $s['heroSub']['en'], $s['heroImage']]);
            echo json_encode(["success" => true]);
        }
        break;

    case 'inquiries':
        if ($method == 'GET') {
            $stmt = $conn->prepare("SELECT * FROM inquiries ORDER BY date DESC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($method == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $conn->exec("DELETE FROM inquiries");
            $stmt = $conn->prepare("INSERT INTO inquiries (id, name, email, msg, date) VALUES (?, ?, ?, ?, ?)");
            foreach ($data as $i) {
                $stmt->execute([$i['id'], $i['name'], $i['email'], $i['msg'], $i['date']]);
            }
            echo json_encode(["success" => true]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}
?>
