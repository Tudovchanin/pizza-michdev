<?php
header('Content-Type: application/json; charset=utf-8');
$config = require 'config.php';
date_default_timezone_set($config['TIMEZONE'] ?? 'Europe/Moscow');
$chat_id = $config['TELEGRAM_CHAT_ID'];
$bot_token = $config['TELEGRAM_BOT_TOKEN'];



// количество запросов 
// сокращенно file_get_contents('rate_limit.json') ?: '{}'; если true вернет file_get_contents('rate_limit.json'), а если false то '{}'
$ip = $_SERVER['REMOTE_ADDR'];
$rateKey = $ip . '_' . date('Y-m-d H');
// для очистки автоматом
$today = date('Y-m-d');
$rates = json_decode(file_get_contents('rate_limit.json') ?: '{}', true); 

// авто очистка раз в сутки
$rates = array_filter($rates, function($key) use ($today) {
    return strpos($key, $today) !== false;
}, ARRAY_FILTER_USE_KEY);


if (($rates[$rateKey] ?? 0) >= 5) { 
    http_response_code(429);
    exit(json_encode(['error' => 'Too many requests (5/hour)']));
}
$rates[$rateKey] = ($rates[$rateKey] ?? 0) + 1;
file_put_contents('rate_limit.json', json_encode($rates));


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid Content-Type']));
}


$timestamp = date('Y-m-d H:i:s') . ' | ';
$json_order = file_get_contents('php://input');


// 1MB ЛИМИТ ДО декодирования 
if (strlen($json_order) > 1048576) {
    http_response_code(413);
    exit(json_encode(['error' => 'Payload too large (max 1MB)']));
}

$data = json_decode($json_order, true);
// проверяем валидность json и на бота. Если скрытый input заполнен, то бот(можно, потом добавить арифметическую операцию на клиенте)
if (json_last_error() !== JSON_ERROR_NONE || empty($data['Phone client'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid data']));
}

// Телефон: только цифры 10-15
if (!preg_match('/[0-9]{10,15}/', preg_replace('/[^0-9]/', '', $data['Phone client']))) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid phone']));
}
// Проверяем тип сообщения
if (!in_array($data["Type"] ?? '', ["Order call", "Order pizza"])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Unknown order type']));
}

file_put_contents('log.txt', $timestamp . $json_order . PHP_EOL, FILE_APPEND | LOCK_EX);







$get_pizza_order_message = function ($data, $timestamp)
{
    $time_display = rtrim($timestamp, ' |');
    $time_order = "⏰ Time: $time_display";
    $count_items = count($data["orders"]);

    $pizza_orders = '';

    foreach ($data["orders"] as $index => $value) {
        $custom_ingredients = '';
        if (is_string($value["Additional ingredients"])) {
            $custom_ingredients = $value["Additional ingredients"];
        } else {
            $custom_ingredients = implode('; ', $value["Additional ingredients"]);
        }
    
        $num = $index + 1;
        $pizza_orders .= " • $num) {$value["Name pizza"]}";
        $pizza_orders .= " {$value["Size"]}";
        $pizza_orders .= " × {$value["Quantity"]}";
        $pizza_orders .= " - {$value["Total price pizza"]}";
        $pizza_orders .= " ($custom_ingredients)\n\n";
    }

    return <<<EOT
    🍕 NEW ORDER {$data["Order ID"]}
    📋 Type: {$data["Type"]}
    
    💰 TOTAL: {$data["Total price orders"]}
    📦 ORDERS: {$count_items} items
    
    📱 Phone: {$data["Phone client"]}
    $time_order


    $pizza_orders

    👨‍💼 Call urgently!
    EOT;
};
$get_call_back_message = function ($data, $timestamp)
{
    $time_display = rtrim($timestamp, ' |');
    $time_order = "⏰ Time: $time_display";
    return <<<EOT
    📞 NEW CALLBACK
    📋 Type: {$data["Type"]}
    
    📱 Phone: {$data["Phone client"]}
    $time_order
    
    👨‍💼 Call urgently!
    EOT;
};

$order_id = $data["Order ID"];

$orders = [
    "Order call"=> $get_call_back_message,
    "Order pizza"=> $get_pizza_order_message
];

$message = $orders[$data["Type"]]($data, $timestamp);

$json_data = json_encode([
    'chat_id' => $chat_id,
    'text' => $message
]);

$CurlOptions = [
    CURLOPT_URL => "https://api.telegram.org/bot{$bot_token}/sendMessage",
    CURLOPT_POST => 1,
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_FOLLOWLOCATION => 1,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $json_data
];

$ch = curl_init();
curl_setopt_array($ch, $CurlOptions);
$res = curl_exec($ch);  
$info = curl_getinfo($ch);  // ← Только для http_code

if (curl_errno($ch) || substr($info['http_code'],0,1) !== '2') {
    file_put_contents('log.txt', $timestamp . "ОШИБКА: " . curl_error($ch) . PHP_EOL, FILE_APPEND | LOCK_EX);
    http_response_code(500);
    echo json_encode(['error' => 'Telegram send failed']);
} else {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "✅ Заказ #{$order_id} отправлен!"
    ]);
    
}

curl_close($ch);
