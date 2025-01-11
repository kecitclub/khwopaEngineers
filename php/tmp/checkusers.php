<?php
require_once '../config/database.php';

$conn = connectDB();

$sql = "SELECT id, username, password, user_type FROM users";
$result = $conn->query($sql);

echo "<h2>Current Users in Database:</h2>";
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . "<br>";
        echo "Username: " . $row['username'] . "<br>";
        echo "Password Hash: " . $row['password'] . "<br>";
        echo "User Type: " . $row['user_type'] . "<br>";
        echo "-------------------<br>";
    }
} else {
    echo "No users found in database";
}

// Create a test hash
echo "<h2>Test Password Hash:</h2>";
$testPassword = "Test@123";
$hash = password_hash($testPassword, PASSWORD_DEFAULT);
echo "Password: " . $testPassword . "<br>";
echo "Generated Hash: " . $hash . "<br>";
echo "Verification Test: " . (password_verify($testPassword, $hash) ? "Success" : "Failed");