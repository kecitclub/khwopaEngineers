<?php
require_once dirname(__DIR__) . '/config/constants.php';
session_start();

function isLoggedIn() {
    return isset($_SESSION[SESSION_USER_ID]) && !empty($_SESSION[SESSION_USER_ID]);
}

function getUserType() {
    return $_SESSION[SESSION_USER_TYPE] ?? null;
}

function checkUserType($allowedTypes) {
    if (!isLoggedIn()) {
        header("Location: /login.php");
        exit();
    }
    
    $userType = getUserType();
    if (!in_array($userType, (array)$allowedTypes)) {
        header("Location: /unauthorized.php");
        exit();
    }
}

function getCurrentUser() {
    if (!isLoggedIn()) return null;
    
    return [
        'id' => $_SESSION[SESSION_USER_ID],
        'username' => $_SESSION[SESSION_USERNAME],
        'full_name' => $_SESSION[SESSION_FULL_NAME],
        'user_type' => $_SESSION[SESSION_USER_TYPE],
        'district_id' => $_SESSION[SESSION_DISTRICT_ID] ?? null,
        'station_id' => $_SESSION[SESSION_STATION_ID] ?? null
    ];
}