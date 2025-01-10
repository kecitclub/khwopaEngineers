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

try {
    // Start transaction
    $conn->begin_transaction();

    // Clear existing data
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    $conn->query("TRUNCATE TABLE users");
    $conn->query("TRUNCATE TABLE stations");
    $conn->query("TRUNCATE TABLE districts");
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");

    // Create Districts
    $sql = "INSERT INTO districts (name, province) VALUES 
        ('Kathmandu', 'Bagmati'),
        ('Lalitpur', 'Bagmati'),
        ('Bhaktapur', 'Bagmati'),
        ('Pokhara', 'Gandaki'),
        ('Bharatpur', 'Bagmati')";
    $conn->query($sql);
    echo "Districts created successfully<br>";

    // Create Stations
    $sql = "INSERT INTO stations (name, district_id, location, status) VALUES
        ('Koteshwor Station', 1, 'Koteshwor, Kathmandu', 'active'),
        ('Thimi Station', 3, 'Thimi, Bhaktapur', 'active'),
        ('Pulchowk Station', 2, 'Pulchowk, Lalitpur', 'active'),
        ('Lakeside Station', 4, 'Lakeside, Pokhara', 'active'),
        ('Narayanghat Station', 5, 'Narayanghat, Bharatpur', 'active')";
    $conn->query($sql);
    echo "Stations created successfully<br>";

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
        3   // station_id
    );

    // Commit transaction
    $conn->commit();
    echo "<br>Database setup completed successfully!<br>";
    echo "You can now login with any of these accounts (password for all: Test@123):<br>";
    echo "- Admin: admin<br>";
    echo "- District: ktm_district, lalitpur_district<br>";
    echo "- Station: ktm_station1, lalitpur_station1<br>";

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo "Error: " . $e->getMessage() . "<br>";
}

$conn->close();
?>