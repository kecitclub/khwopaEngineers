<?php
class VehicleManager {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getAllVehicles($page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        $query = "SELECT v.*, o.owner_name FROM vehicle_info v 
                LEFT JOIN vehicle_owner vo ON v.vehicle_id = vo.vehicle_id 
                LEFT JOIN owner_info o ON vo.owner_id = o.owner_id 
                LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function searchVehicle($numberPlate) {
        $query = "SELECT v.*, o.owner_name FROM vehicle_info v 
                LEFT JOIN vehicle_owner vo ON v.vehicle_id = vo.vehicle_id 
                LEFT JOIN owner_info o ON vo.owner_id = o.owner_id 
                WHERE v.number_plate = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $numberPlate);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}