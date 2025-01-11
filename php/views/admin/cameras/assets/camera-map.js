// Map instance and layer groups
let map, cameraLayer, stationLayer, boundaryLayer;
let stationsData = {};

// Initialize map
function initializeMap() {
    // Create map instance centered on Kathmandu
    map = L.map('map').setView([27.7172, 85.3240], 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Create layer groups
    cameraLayer = L.layerGroup().addTo(map);
    stationLayer = L.layerGroup().addTo(map);
    boundaryLayer = L.layerGroup();
    
    // Add controls
    L.control.scale().addTo(map);
    map.zoomControl.setPosition('topright');
}

// Create custom marker
function createCustomMarker(type, isActive = true, isSub = false) {
    const className = `custom-marker marker-${type} ${!isActive ? 'inactive' : ''} ${isSub ? 'sub' : ''}`;
    const icon = type === 'camera' ? 'camera-fill' : 'building';
    
    return L.divIcon({
        className,
        html: `<i class="bi bi-${icon}"></i>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
}

// Load stations data
async function loadStations() {
    try {
        const response = await fetch('assets/data/camera-map.json');
        const data = await response.json();
        
        // Store stations data globally
        stationsData = data.stations.reduce((acc, station) => {
            acc[station.id] = station;
            return acc;
        }, {});
        
        // Update statistics
        updateStationStatistics(data.stations);
        
        // Add markers and boundaries
        data.stations.forEach(addStationToMap);
        
        // Load cameras after stations
        addCamerasToMap(data.cameras);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load map data');
    }
}

// Add station to map
function addStationToMap(station) {
    // Add station marker
    const marker = L.marker([station.latitude, station.longitude], {
        icon: createCustomMarker('station', true, station.type === 'secondary')
    })
    .bindTooltip(station.name)
    .bindPopup(createStationPopup(station));
    
    stationLayer.addLayer(marker);
    
    // Add boundary polygon if available
    if (station.boundary && station.boundary.length > 0) {
        const polygon = L.polygon(station.boundary, {
            color: station.type === 'main' ? '#007bff' : '#6c757d',
            fillColor: station.type === 'main' ? '#007bff' : '#6c757d',
            fillOpacity: 0.2,
            weight: 2,
            className: 'coverage-area'
        }).bindTooltip(station.name + ' Coverage Area');
        
        boundaryLayer.addLayer(polygon);
    }
}

// Add cameras to map
function addCamerasToMap(cameras) {
    // Update statistics first
    updateCameraStatistics(cameras);
    
    // Add camera markers
    cameras.forEach(camera => {
        const station = stationsData[camera.stationId];
        const isActive = camera.status === 'active';
        
        const marker = L.marker([camera.latitude, camera.longitude], {
            icon: createCustomMarker('camera', isActive)
        })
        .bindTooltip(camera.name)
        .bindPopup(createCameraPopup(camera, station));
        
        cameraLayer.addLayer(marker);
    });
}

// Create popups
function createStationPopup(station) {
    return `
        <div class="popup-content">
            <h5>${station.name}</h5>
            <p>
                <strong>Type:</strong> ${station.type}<br>
                <strong>Coverage:</strong> ${station.coverage}<br>
                <strong>Staff:</strong> ${station.staff} personnel<br>
                ${station.contact ? `<strong>Contact:</strong> ${station.contact}` : ''}
            </p>
        </div>
    `;
}

function createCameraPopup(camera, station) {
    return `
        <div class="popup-content">
            <h5>${camera.name}</h5>
            <p>
                <strong>Status:</strong> ${camera.status}<br>
                <strong>Type:</strong> ${camera.type}<br>
                <strong>Resolution:</strong> ${camera.resolution}<br>
                <strong>Station:</strong> ${station ? station.name : 'Unknown'}<br>
                <strong>Last Maintained:</strong> ${formatDate(camera.lastMaintenance)}
            </p>
        </div>
    `;
}

// Update statistics
function updateStationStatistics(stations) {
    const totalStations = stations.length;
    animateCounter('stationCount', totalStations);
    animateCounter('totalStations', totalStations);
    
    const coverageAreas = stations.reduce((acc, station) => {
        return acc + (station.boundary ? 1 : 0);
    }, 0);
    animateCounter('coverageArea', coverageAreas);
}

function updateCameraStatistics(cameras) {
    const totalCameras = cameras.length;
    animateCounter('cameraCount', totalCameras);
    animateCounter('totalCameras', totalCameras);
    
    const activeCameras = cameras.filter(camera => camera.status === 'active').length;
    animateCounter('activeCameraCount', activeCameras);
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const duration = 1000;
    const steps = 20;
    const increment = finalValue / steps;
    const stepDuration = duration / steps;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = Math.round(finalValue);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(currentValue);
        }
    }, stepDuration);
}

function showError(message) {
    // You can implement your own error display mechanism here
    console.error(message);
}

// Toggle event listeners
function initializeEventListeners() {
    // Layer toggles
    document.getElementById('toggleCameras').addEventListener('change', function(e) {
        if (e.target.checked) {
            map.addLayer(cameraLayer);
        } else {
            map.removeLayer(cameraLayer);
        }
    });

    document.getElementById('toggleStations').addEventListener('change', function(e) {
        if (e.target.checked) {
            map.addLayer(stationLayer);
        } else {
            map.removeLayer(stationLayer);
        }
    });

    document.getElementById('toggleBoundaries').addEventListener('change', function(e) {
        if (e.target.checked) {
            map.addLayer(boundaryLayer);
        } else {
            map.removeLayer(boundaryLayer);
        }
    });

    // Fullscreen toggle
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
}

// Fullscreen functionality
function toggleFullscreen() {
    const mapContainer = document.querySelector('.map-container');
    
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
        mapContainer.classList.add('fullscreen');
    } else {
        document.exitFullscreen();
        mapContainer.classList.remove('fullscreen');
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeEventListeners();
    loadStations();
});