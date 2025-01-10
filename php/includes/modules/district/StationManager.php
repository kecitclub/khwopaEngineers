<?php
class StationManager {
    private $conn;
    private $district_id;

    public function __construct($conn, $district_id) {
        $this->conn = $conn;
        $this->district_id = $district_id;
    }

    public function getDistrictStations() {
        $query = "SELECT * FROM stations WHERE district_id = ? AND status = 'active'";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->district_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getStationCameras($station_id) {
        $query = "SELECT * FROM camera_info WHERE station_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $station_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}