<?php
class CameraManager {
    private $conn;
    private $station_id;

    public function __construct($conn, $station_id) {
        $this->conn = $conn;
        $this->station_id = $station_id;
    }

    public function getStationCameras() {
        $query = "SELECT * FROM camera_info WHERE station_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->station_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getCameraLogs($camera_id, $start_date = null, $end_date = null) {
        $query = "SELECT * FROM log_info WHERE camid = ?";
        if ($start_date && $end_date) {
            $query .= " AND timestamp BETWEEN ? AND ?";
        }
        $query .= " ORDER BY timestamp DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($start_date && $end_date) {
            $stmt->bind_param("iss", $camera_id, $start_date, $end_date);
        } else {
            $stmt->bind_param("i", $camera_id);
        }
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}