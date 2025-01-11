<?php
define('DB_HOST', '193.203.185.164');
define('DB_USER', 'u290660616_pustak');
define('DB_PASS', 'Pustak@237');
define('DB_NAME', 'u290660616_pustak');

function connectDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8");
    return $conn;
}