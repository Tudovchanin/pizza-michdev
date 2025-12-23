<?php
header('Content-Type: application/json; charset=utf-8');
$config = require 'config.php';
date_default_timezone_set($config['TIMEZONE'] ?? 'Europe/Moscow');
$chat_id = $config['TELEGRAM_CHAT_ID'];
$bot_token = $config['TELEGRAM_BOT_TOKEN'];

$timestamp = date('Y-m-d H:i:s') . ' | ';
$json_order = file_get_contents('php://input');
file_put_contents('log.txt', $timestamp . $json_order . PHP_EOL, FILE_APPEND | LOCK_EX);

$get_pizza_order_message = function ($data, $timestamp)
{
    $time_display = rtrim($timestamp, ' |');
    $time_order = "⏰ Time: $time_display";
    $count_items = count($data["orders"]);

    $pizza_orders = '';

    foreach ($data["orders"] as $key => $value) {
        $custom_ingredients = '';
        if (is_string($value["Additional ingredients"])) {
            $custom_ingredients = $value["Additional ingredients"];
        } else {
            $custom_ingredients =implode('; ', $value["Additional ingredients"]);
        }
    
        ++$key;
        $pizza_orders .= " • $key) {$value["Name pizza"]}";
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

$data = json_decode($json_order, true);
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
    echo json_encode(['status' => 'success']);
}

curl_close($ch);
