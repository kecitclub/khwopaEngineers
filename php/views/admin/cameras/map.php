<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Camera Map System</title>
    
    <!-- CSS Dependencies -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" rel="stylesheet">
    <link href="assets/camera-map.css" rel="stylesheet">
</head>
<body>
    <div class="camera-map-header">
        <div class="container">
        <div class="col-md-8">
      <h1 class="display-4"><i class="bi bi-map"></i> Traffic Camera Map</h1>
    </div>
            
            <div class="statistics-panel mt-4">
            <div class="container">
                <div class="row">
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="bi bi-camera-fill"></i></div>
                            <div class="stat-info">
                                <h3 id="cameraCount">0</h3>
                                <p>Total Cameras</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="bi bi-camera-video-fill"></i></div>
                            <div class="stat-info">
                                <h3 id="activeCameraCount">0</h3>
                                <p>Active Cameras</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="bi bi-building"></i></div>
                            <div class="stat-info">
                                <h3 id="stationCount">0</h3>
                                <p>Total Stations</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="bi bi-geo-alt-fill"></i></div>
                            <div class="stat-info">
                                <h3 id="coverageArea">0</h3>
                                <p>Coverage Areas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
        </div>
    </div>

    <div class="container-fluid mt-4">
        <div class="map-container">
            <div id="map">
                <div class="map-controls">
                    <div class="controls-container">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="toggleCameras" checked>
                            <label class="form-check-label" for="toggleCameras">Cameras</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="toggleStations" checked>
                            <label class="form-check-label" for="toggleStations">Stations</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="toggleBoundaries">
                            <label class="form-check-label" for="toggleBoundaries">Coverage Areas</label>
                        </div>
                        <button id="fullscreenBtn" class="btn btn-sm btn-primary">
                            <i class="bi bi-arrows-fullscreen"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="assets/camera-map.js"></script>
</body>
</html>