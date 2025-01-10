<?php
require_once '../config/database.php';

$conn = connectDB();

// Function to create user
function createUser($conn, $username, $password, $fullName, $email, $phone, $userType, $districtId = null, $stationId = null) {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (username, password, full_name, email, phone, user_type, district_id, station_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssii", $username, $hashedPassword, $fullName, $email, $phone, $userType, $districtId, $stationId);
    
    if ($stmt->execute()) {
        echo "User '$username' created successfully<br>";
        return true;
    } else {
        echo "Error creating user '$username': " . $conn->error . "<br>";
        return false;
    }
}

// Clear existing users
$conn->query("TRUNCATE TABLE users");

// Create Admin Users
createUser(
    $conn,
    'admin',
    'Test@123',
    'System Admin',
    'admin@trafficsystem.com',
    '9841000000',
    'admin'
);

// Create District Users
createUser(
    $conn,
    'ktm_district',
    'Test@123',
    'Hari Prasad Sharma',
    'ktm@district.com',
    '9841111111',
    'district',
    1  // district_id
);

createUser(
    $conn,
    'lalitpur_district',
    'Test@123',
    'Ram Kumar Shrestha',
    'lalitpur@district.com',
    '9841222222',
    'district',
    2  // district_id
);

// Create Station Users
createUser(
    $conn,
    'ktm_station1',
    'Test@123',
    'Sita Kumari Poudel',
    'ktm.station1@station.com',
    '9841333333',
    'station',
    1,  // district_id
    1   // station_id
);

createUser(
    $conn,
    'lalitpur_station1',
    'Test@123',
    'Binod Adhikari',
    'lalitpur.station1@station.com',
    '9841444444',
    'station',
    2,  // district_id
    2   // station_id
);

$conn->close();
echo "<br>All users created with password: Test@123";
?>