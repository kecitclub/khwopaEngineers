<?php
require_once '../config/database.php';

$conn = connectDB();

try {
    // Start transaction
    $conn->begin_transaction();

    // Clear existing data
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    $conn->query("TRUNCATE TABLE users");
    $conn->query("TRUNCATE TABLE station_info");
    $conn->query("TRUNCATE TABLE districts");
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");

    // Insert districts
    $districts = [
        ['name' => 'Kathmandu', 'province' => 'Bagmati'],
        ['name' => 'Lalitpur', 'province' => 'Bagmati'],
        ['name' => 'Bhaktapur', 'province' => 'Bagmati']
    ];

    $districtStmt = $conn->prepare("INSERT INTO districts (name, province, status) VALUES (?, ?, 'active')");
    foreach ($districts as $district) {
        $districtStmt->bind_param("ss", $district['name'], $district['province']);
        $districtStmt->execute();
        echo "Created district: " . $district['name'] . "<br>";
    }

    // Insert stations (without specifying station_id)
    $stations = [
        [
            'name' => 'Koteshwor Station', 
            'latitude' => 27.6788, 
            'longitude' => 85.3492, 
            'contact_number' => '01-4498765'
        ],
        [
            'name' => 'Tinkune Station', 
            'latitude' => 27.6853, 
            'longitude' => 85.3459, 
            'contact_number' => '01-4498766'
        ],
        [
            'name' => 'Pulchowk Station', 
            'latitude' => 27.6817, 
            'longitude' => 85.3186, 
            'contact_number' => '01-4498767'
        ]
    ];

    $stationStmt = $conn->prepare("INSERT INTO station_info (station_name, latitude, longitude, contact_number) VALUES (?, ?, ?, ?)");
    
    foreach ($stations as $station) {
        $stationStmt->bind_param("sdds", 
            $station['name'],
            $station['latitude'],
            $station['longitude'],
            $station['contact_number']
        );
        
        if($stationStmt->execute()) {
            echo "Created station: " . $station['name'] . "<br>";
        } else {
            throw new Exception("Error creating station " . $station['name'] . ": " . $conn->error);
        }
    }

    // Insert users
    $users = [
        [
            'username' => 'admin',
            'password' => 'test123',
            'full_name' => 'System Admin',
            'email' => 'admin@trafficsystem.com',
            'phone' => '9841000000',
            'user_type' => 'admin',
            'district_id' => NULL,
            'station_id' => NULL
        ],
        [
            'username' => 'ktm_district',
            'password' => 'test123',
            'full_name' => 'Kathmandu District Admin',
            'email' => 'ktm@district.com',
            'phone' => '9841111111',
            'user_type' => 'district',
            'district_id' => 1,
            'station_id' => NULL
        ],
        [
            'username' => 'ktm_station1',
            'password' => 'test123',
            'full_name' => 'Koteshwor Station Admin',
            'email' => 'ktm.station1@station.com',
            'phone' => '9841222222',
            'user_type' => 'station',
            'district_id' => 1,
            'station_id' => 1
        ]
    ];

    $userStmt = $conn->prepare("INSERT INTO users (username, password, full_name, email, phone, user_type, district_id, station_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')");
    foreach ($users as $user) {
        $hashedPassword = password_hash($user['password'], PASSWORD_DEFAULT);
        $userStmt->bind_param("ssssssii", 
            $user['username'],
            $hashedPassword,
            $user['full_name'],
            $user['email'],
            $user['phone'],
            $user['user_type'],
            $user['district_id'],
            $user['station_id']
        );
        
        if ($userStmt->execute()) {
            echo "Created user: " . $user['username'] . " with role: " . $user['user_type'] . "<br>";
        } else {
            throw new Exception("Error creating user " . $user['username'] . ": " . $conn->error);
        }
    }

    // Commit transaction
    $conn->commit();

    echo "<br>All data initialized successfully! <br>";
    echo "You can login with any of these usernames: <br>";
    echo "- admin <br>";
    echo "- ktm_district <br>";
    echo "- ktm_station1 <br>";
    echo "<br>Password for all users: test123";

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo "Error: " . $e->getMessage();
} finally {
    $conn->close();
}