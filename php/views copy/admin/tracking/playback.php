<?php
// Read tracking log data
$trackingLog = json_decode(file_get_contents('assets/data/tracking-log.json'), true) ?? [];
$trackingList = json_decode(file_get_contents('assets/data/tracking-list.json'), true) ?? [];

// Get unique vehicles that have been spotted
$uniqueVehicles = [];
foreach ($trackingLog as $log) {
    if (!isset($uniqueVehicles[$log['numberPlate']])) {
        // Find vehicle info from tracking list
        $vehicleInfo = array_values(array_filter($trackingList, function($item) use ($log) {
            return $item['numberPlate'] === $log['numberPlate'];
        }))[0] ?? null;
        
        if ($vehicleInfo) {
            $uniqueVehicles[$log['numberPlate']] = $vehicleInfo['vehicleInfo'];
        }
    }
}

// Count total detections
$totalDetections = count($trackingLog);

// Get latest detection time
$latestDetection = !empty($trackingLog) ? max(array_column($trackingLog, 'timestamp')) : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Journey Playback System</title>
    
    <!-- CSS Dependencies -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" rel="stylesheet">
    <link href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" rel="stylesheet">
    <link href="assets/css/journey-playback.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid py-4">
        <div class="dashboard-container">
            <!-- Header Section -->
            <div class="header-section">
                <div class="row align-items-center">
                    <div class="col">
                        <h1><i class="fas fa-route me-2"></i>Journey Playback System</h1>
                        <p class="mb-0">Track and analyze vehicle movement history in Kathmandu</p>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-car"></i>
                    </div>
                    <h3><?php echo count($uniqueVehicles); ?></h3>
                    <p>Tracked Vehicles</p>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <h3><?php echo $totalDetections; ?></h3>
                    <p>Total Detections</p>
                </div>
                <div class="stat-card" id="selectedVehicleStats">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>-</h3>
                    <p>Route Duration</p>
                </div>
                <div class="stat-card" id="distanceStats">
                    <div class="stat-icon">
                        <i class="fas fa-road"></i>
                    </div>
                    <h3>-</h3>
                    <p>Total Distance</p>
                </div>
            </div>

            <!-- Control Panel -->
            <div class="control-panel">
                <div class="row g-3 align-items-center">
                    <div class="col-md-3">
                        <label class="form-label">
                            <i class="fas fa-car me-2"></i>Select Vehicle
                        </label>
                        <select id="vehicleSelect" class="form-select">
                            <option value="">Choose a vehicle...</option>
                            <?php foreach ($uniqueVehicles as $plate => $info): ?>
                                <option value="<?php echo htmlspecialchars($plate); ?>">
                                    <?php echo htmlspecialchars("$plate - {$info['make']} {$info['model']}"); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">
                            <i class="fas fa-calendar me-2"></i>Date Range
                        </label>
                        <select id="dateRange" class="form-select">
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">
                            <i class="fas fa-clock me-2"></i>Time Range
                        </label>
                        <select id="timeRange" class="form-select">
                            <option value="all">All Hours</option>
                            <option value="morning">Morning (6 AM - 12 PM)</option>
                            <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                            <option value="evening">Evening (6 PM - 12 AM)</option>
                            <option value="night">Night (12 AM - 6 AM)</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">&nbsp;</label>
                        <button id="trackBtn" class="btn btn-primary w-100" disabled>
                            <i class="fas fa-route me-2"></i>Track Vehicle
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading Overlay -->
            <div id="loadingOverlay" class="loading-overlay d-none">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="mt-3">Loading Route Data...</div>
                </div>
            </div>

            <!-- Error Container -->
            <div id="errorContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1100"></div>

            <!-- Main Content Area -->
            <div class="row mt-4">
                <!-- Map Section -->
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="fas fa-map-marked-alt me-2"></i>Route Map
                                </div>
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-light active" id="toggleCameras">
                                        <i class="fas fa-video me-1"></i>Cameras
                                    </button>
                                    <button class="btn btn-sm btn-outline-light" id="toggleTraffic">
                                        <i class="fas fa-traffic-light me-1"></i>Traffic
                                    </button>
                                    <button class="btn btn-sm btn-outline-light" onclick="map.locate({setView: true, maxZoom: 16})">
                                        <i class="fas fa-location-arrow me-1"></i>Current Location
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div id="map"></div>
                        </div>
                    </div>

                    <!-- Route Information Panel -->
                    <div class="card mt-3">
                        <div class="card-header">
                            <i class="fas fa-info-circle me-2"></i>Route Information
                        </div>
                        <div class="card-body">
                            <div id="routeDetails">
                                <div class="text-muted text-center">
                                    Select a vehicle and click Track to view route details
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline Section -->
                <div class="col-lg-4">
                    <!-- Vehicle Info Card -->
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-car me-2"></i>Vehicle Information
                        </div>
                        <div class="card-body" id="vehicleInfo">
                            <div class="text-muted text-center">
                                Select a vehicle to view information
                            </div>
                        </div>
                    </div>

                    <!-- Timeline Card -->
                    <div class="card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="fas fa-history me-2"></i>Journey Timeline
                                </div>
                                <div>
                                    <span class="badge bg-primary" id="detectionCount">0 Detections</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="timeline" class="timeline">
                                <div class="text-center text-muted">
                                    <i class="fas fa-info-circle me-2"></i>Select a vehicle and click Track to view timeline
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="mt-4 text-center text-muted">
                <small>
                    <i class="fas fa-shield-alt me-1"></i>Journey Playback System v1.0 
                    <span class="mx-2">|</span> 
                    <i class="fas fa-clock me-1"></i>Last Updated: 
                    <span id="lastUpdateTime">
                        <?php echo $latestDetection ? date('Y-m-d H:i:s', strtotime($latestDetection)) : '-'; ?>
                    </span>
                </small>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <script src="https://unpkg.com/leaflet.polylinedecorator@1.6.0/dist/leaflet.polylineDecorator.js"></script>
    <script src="assets/js/journey-playback.js"></script>

    <!-- Initialize Vehicle Info -->
    <script>
        document.getElementById('vehicleSelect').addEventListener('change', function() {
            const vehicleInfo = document.getElementById('vehicleInfo');
            const selectedOption = this.options[this.selectedIndex];
            
            if (this.value) {
                const vehicleData = <?php echo json_encode($uniqueVehicles); ?>[this.value];
                vehicleInfo.innerHTML = `
                    <div class="vehicle-details">
                        <div class="mb-2">
                            <strong><i class="fas fa-license-plate me-2"></i>Number Plate:</strong>
                            <span class="badge bg-primary">${this.value}</span>
                        </div>
                        <div class="mb-2">
                            <strong><i class="fas fa-car me-2"></i>Vehicle:</strong>
                            ${vehicleData.make} ${vehicleData.model}
                        </div>
                        <div class="mb-2">
                            <strong><i class="fas fa-palette me-2"></i>Color:</strong>
                            ${vehicleData.color}
                        </div>
                        <div>
                            <strong><i class="fas fa-calendar me-2"></i>Year:</strong>
                            ${vehicleData.year}
                        </div>
                    </div>
                `;
            } else {
                vehicleInfo.innerHTML = `
                    <div class="text-muted text-center">
                        Select a vehicle to view information
                    </div>
                `;
            }
        });
    </script>
</body>
</html>