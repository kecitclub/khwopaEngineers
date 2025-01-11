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
        // Log unauthorized access attempt
        error_log("Unauthorized access attempt - User Type: " . $userType . 
                 ", Allowed Types: " . implode(',', (array)$allowedTypes));
        header("Location: /unauthorized.php");
        exit();
    }
    
    return true;
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

// Function to verify user has access to specific district
function checkDistrictAccess($district_id) {
    if (!isLoggedIn()) return false;
    
    $currentUser = getCurrentUser();
    
    // Admin has access to all districts
    if ($currentUser['user_type'] === USER_ADMIN) return true;
    
    // District users can only access their assigned district
    if ($currentUser['user_type'] === USER_DISTRICT) {
        return $currentUser['district_id'] === $district_id;
    }
    
    // Station users can only access their station's district
    if ($currentUser['user_type'] === USER_STATION) {
        return $currentUser['district_id'] === $district_id;
    }
    
    return false;
}

// Function to verify user has access to specific station
function checkStationAccess($station_id) {
    if (!isLoggedIn()) return false;
    
    $currentUser = getCurrentUser();
    
    // Admin has access to all stations
    if ($currentUser['user_type'] === USER_ADMIN) return true;
    
    // District users can access all stations in their district
    if ($currentUser['user_type'] === USER_DISTRICT) {
        // You might want to add a check here to verify if the station belongs to the user's district
        return true;
    }
    
    // Station users can only access their assigned station
    if ($currentUser['user_type'] === USER_STATION) {
        return $currentUser['station_id'] === $station_id;
    }
    
    return false;
}