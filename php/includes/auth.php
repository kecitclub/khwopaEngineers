<?php
require_once dirname(__DIR__) . '/config/constants.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once 'session.php';

function authenticateUser($username, $password) {
    $conn = connectDB();
    
    // For debugging
    error_log("Login attempt - Username: " . $username);
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // For debugging
        error_log("User found - Password verification starting");
        error_log("Stored hash: " . $user['password']);
        error_log("Password verify result: " . (password_verify($password, $user['password']) ? 'true' : 'false'));
        
        if (password_verify($password, $user['password'])) {
            $_SESSION[SESSION_USER_ID] = $user['id'];
            $_SESSION[SESSION_USERNAME] = $user['username'];
            $_SESSION[SESSION_FULL_NAME] = $user['full_name'];
            $_SESSION[SESSION_USER_TYPE] = $user['user_type'];
            $_SESSION[SESSION_DISTRICT_ID] = $user['district_id'];
            $_SESSION[SESSION_STATION_ID] = $user['station_id'];
            
            $updateStmt = $conn->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->bind_param("i", $user['id']);
            $updateStmt->execute();
            
            return true;
        }
    }
    
    // For debugging
    error_log("Authentication failed");
    return false;
}