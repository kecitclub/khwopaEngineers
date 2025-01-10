<?php
class Logger {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function logVehicleDetection($number_plate, $image_url, $camid) {
        $query = "INSERT INTO log_info (number_plate, image_url, camid, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $number_plate, $image_url, $camid);
        return $stmt->execute();
    }

    public function getRecentLogs($limit = 10) {
        $query = "SELECT l.*, c.camip, s.station_name 
                FROM log_info l 
                JOIN camera_info c ON l.camid = c.camid 
                JOIN stations s ON c.station_id = s.id 
                ORDER BY l.timestamp DESC LIMIT ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}