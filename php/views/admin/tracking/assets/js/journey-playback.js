// Global variables
let map, routeLayer;
let markers = [];
let cameraMarkers = [];
let isTrafficVisible = false;
let isCamerasVisible = true;
let activeMarker = null;
let customRouteLayer = null;

// Initialize map
function initMap() {
    map = L.map('map', {
        center: [27.7172, 85.3240], // Kathmandu center
        zoom: 13,
        zoomControl: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add scale control
    L.control.scale({ imperial: false, metric: true }).addTo(map);

    // Load cameras
    loadCameras();

    // Add event listeners for toggles
    document.getElementById('toggleTraffic').addEventListener('click', () => {
        isTrafficVisible = !isTrafficVisible;
        toggleTrafficLayer(isTrafficVisible);
        document.getElementById('toggleTraffic').classList.toggle('active');
    });

    document.getElementById('toggleCameras').addEventListener('click', () => {
        isCamerasVisible = !isCamerasVisible;
        toggleCameras();
        document.getElementById('toggleCameras').classList.toggle('active');
    });
}

// Load and display cameras
async function loadCameras() {
    try {
        const response = await fetch('assets/data/cameras.json');
        const cameras = await response.json();

        cameras.forEach(camera => {
            const marker = createCameraMarker(camera);
            cameraMarkers.push(marker);
            if (isCamerasVisible) {
                marker.addTo(map);
            }
        });
    } catch (error) {
        console.error('Error loading cameras:', error);
        showError('Failed to load camera locations');
    }
}

// Create camera marker
function createCameraMarker(camera) {
    const icon = L.divIcon({
        className: 'custom-camera-marker',
        html: `
            <div class="camera-marker ${camera.status || 'active'}">
                <i class="fas fa-video"></i>
                <span class="pulse"></span>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    return L.marker([camera.lat, camera.lng], { icon })
        .bindPopup(`
            <div class="camera-popup">
                <h6>${camera.location}</h6>
                <p><strong>Status:</strong> <span class="status-badge ${camera.status || 'active'}">${camera.status || 'Active'}</span></p>
                <p><strong>ID:</strong> ${camera.id}</p>
            </div>
        `);
}

// OSRM Routing function
async function getOSRMRoute(coordinates) {
    try {
        // Format coordinates for OSRM (lng,lat format)
        const coordinateString = coordinates
            .map(coord => `${coord[1]},${coord[0]}`)
            .join(';');

        // Make request to OSRM
        const response = await fetch(
            `http://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=full&geometries=geojson&steps=true`
        );
        
        if (!response.ok) throw new Error('Routing failed');
        
        const data = await response.json();
        
        if (data.code !== 'Ok' || !data.routes[0]) {
            throw new Error('No route found');
        }

        return {
            geometry: data.routes[0].geometry,
            distance: data.routes[0].distance / 1000, // Convert to km
            duration: data.routes[0].duration / 60,   // Convert to minutes
            steps: data.routes[0].legs[0].steps
        };
    } catch (error) {
        console.error('OSRM routing error:', error);
        throw error;
    }
}

// Create route on map
async function createRoute(coordinates) {
    try {
        if (coordinates.length < 2) {
            throw new Error('At least two points are needed for routing');
        }

        // Clear existing route
        if (routeLayer) {
            map.removeLayer(routeLayer);
        }
        if (customRouteLayer) {
            map.removeLayer(customRouteLayer);
        }

        const routeData = await getOSRMRoute(coordinates);

        // Create main route layer
        routeLayer = L.geoJSON(routeData.geometry, {
            style: {
                color: '#007bff',
                weight: 5,
                opacity: 0.7,
                lineCap: 'round',
                lineJoin: 'round'
            }
        }).addTo(map);

        // Add direction arrows
        customRouteLayer = L.polylineDecorator(routeLayer, {
            patterns: [
                {
                    offset: 25,
                    repeat: 100,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 12,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            color: '#007bff',
                            weight: 3
                        }
                    })
                }
            ]
        }).addTo(map);

        // Fit map to show entire route
        map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

        return {
            distance: routeData.distance,
            duration: routeData.duration
        };
    } catch (error) {
        console.error('Route creation error:', error);
        showError('Could not create route. Using direct lines instead.');
        
        // Fallback to direct lines
        return createDirectRoute(coordinates);
    }
}

// Create direct route (fallback)
function createDirectRoute(coordinates) {
    const polyline = L.polyline(coordinates, {
        color: '#FF3366',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    routeLayer = polyline;

    // Calculate straight-line distance
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        totalDistance += map.distance(coordinates[i], coordinates[i + 1]);
    }

    return {
        distance: totalDistance / 1000,
        duration: (totalDistance / 1000) * 2 // Rough estimate: 30 km/h average speed
    };
}

// Toggle camera visibility
function toggleCameras() {
    cameraMarkers.forEach(marker => {
        if (isCamerasVisible) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

// Toggle traffic layer
function toggleTrafficLayer(show) {
    // Implement traffic layer toggle if available
    console.log('Traffic layer toggled:', show);
}

// Show loading state
function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    const trackBtn = document.getElementById('trackBtn');
    
    if (show) {
        overlay.classList.remove('d-none');
        trackBtn.disabled = true;
        trackBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    } else {
        overlay.classList.add('d-none');
        trackBtn.disabled = false;
        trackBtn.innerHTML = '<i class="fas fa-route me-2"></i>Track Vehicle';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.getElementById('errorContainer').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Clear map data
function clearMap() {
    // Clear vehicle markers
    markers.forEach(marker => marker.remove());
    markers = [];
    
    // Clear route layers
    if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
    if (customRouteLayer) {
        map.removeLayer(customRouteLayer);
        customRouteLayer = null;
    }

    // Clear timeline
    document.getElementById('timeline').innerHTML = '';
    document.getElementById('routeDetails').innerHTML = '<div class="text-muted text-center">No route selected</div>';
    document.getElementById('detectionCount').textContent = '0 Detections';

    // Reset stats
    document.getElementById('selectedVehicleStats').innerHTML = `
        <div class="stat-icon"><i class="fas fa-clock"></i></div>
        <h3>-</h3>
        <p>Route Duration</p>
    `;
    document.getElementById('distanceStats').innerHTML = `
        <div class="stat-icon"><i class="fas fa-road"></i></div>
        <h3>-</h3>
        <p>Total Distance</p>
    `;
}

// Create timeline item
function addTimelineItem(text, timestamp, location, isActive = false) {
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${isActive ? 'active' : ''}`;
    timelineItem.innerHTML = `
        <div class="d-flex justify-content-between">
            <strong>${text}</strong>
            <small>${new Date(timestamp).toLocaleTimeString()}</small>
        </div>
        <div class="mt-1">
            <i class="fas fa-map-marker-alt me-1"></i>${location}<br>
            <small class="text-muted">${new Date(timestamp).toLocaleDateString()}</small>
        </div>
    `;
    document.getElementById('timeline').appendChild(timelineItem);
    return timelineItem;
}

// Update route details
function updateRouteDetails(routeInfo, detections) {
    const averageSpeed = routeInfo.distance / (routeInfo.duration / 60); // km/h
    document.getElementById('routeDetails').innerHTML = `
        <div class="route-info">
            <div class="mb-3">
                <i class="fas fa-road me-2"></i>
                <strong>Distance:</strong> ${routeInfo.distance.toFixed(1)} km
            </div>
            <div class="mb-3">
                <i class="fas fa-clock me-2"></i>
                <strong>Duration:</strong> ${Math.round(routeInfo.duration)} minutes
            </div>
            <div class="mb-3">
                <i class="fas fa-tachometer-alt me-2"></i>
                <strong>Avg. Speed:</strong> ${averageSpeed.toFixed(1)} km/h
            </div>
            <div>
                <i class="fas fa-camera me-2"></i>
                <strong>Detections:</strong> ${detections} camera points
            </div>
        </div>
    `;

    // Update stats cards
    document.getElementById('selectedVehicleStats').innerHTML = `
        <div class="stat-icon"><i class="fas fa-clock"></i></div>
        <h3>${Math.round(routeInfo.duration)}</h3>
        <p>Route Duration (min)</p>
    `;
    document.getElementById('distanceStats').innerHTML = `
        <div class="stat-icon"><i class="fas fa-road"></i></div>
        <h3>${routeInfo.distance.toFixed(1)}</h3>
        <p>Total Distance (km)</p>
    `;
}

// Load and display vehicle route
async function loadVehicleRoute(numberPlate, dateRange = 'all', timeRange = 'all') {
    showLoading(true);
    clearMap();

    try {
        const vehicleLogs = await getFilteredVehicleLogs(numberPlate, dateRange, timeRange);
        
        if (vehicleLogs.length === 0) {
            showError('No tracking data found for this vehicle in the selected time range');
            return;
        }

        // Update detection count
        document.getElementById('detectionCount').textContent = `${vehicleLogs.length} Detections`;

        const coordinates = vehicleLogs.map(log => [log.location.lat, log.location.lng]);
        const routeInfo = await createRoute(coordinates);
        
        if (routeInfo) {
            updateRouteDetails(routeInfo, vehicleLogs.length);
            
            // Add markers and timeline items
            vehicleLogs.forEach((log, index) => {
                let markerColor, markerText;
                
                if (index === 0) {
                    markerColor = '#00cc00'; // Green for start
                    markerText = 'First Detection';
                } else if (index === vehicleLogs.length - 1) {
                    markerColor = '#ff3300'; // Red for end
                    markerText = 'Latest Detection';
                } else {
                    markerColor = '#1a75ff'; // Blue for intermediate
                    markerText = `Detection ${index + 1}`;
                }

                const icon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${markerColor}"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                });

                const marker = L.marker([log.location.lat, log.location.lng], { icon })
                    .bindPopup(`
                        <div class="marker-popup">
                            <strong>${markerText}</strong><br>
                            Time: ${new Date(log.timestamp).toLocaleString()}<br>
                            Location: ${log.camera}
                        </div>
                    `)
                    .addTo(map);

                markers.push(marker);

                const timelineItem = addTimelineItem(markerText, log.timestamp, log.camera, false);

                // Link timeline and marker interactions
                timelineItem.addEventListener('click', () => {
                    markers.forEach(m => m.setOpacity(0.5));
                    marker.setOpacity(1);
                    marker.openPopup();
                    map.setView([log.location.lat, log.location.lng], 15);
                    
                    // Update timeline items
                    document.querySelectorAll('.timeline-item').forEach(item => item.classList.remove('active'));
                    timelineItem.classList.add('active');
                });

                // Marker hover effect
                marker.on('mouseover', () => {
                    timelineItem.classList.add('active');
                    marker.setOpacity(1);
                }).on('mouseout', () => {
                    if (!marker.isPopupOpen()) {
                        timelineItem.classList.remove('active');
                        marker.setOpacity(0.8);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading route:', error);
        showError('Error loading route data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Get filtered vehicle logs
async function getFilteredVehicleLogs(numberPlate, dateRange, timeRange) {
const response = await fetch('assets/data/tracking-log.json');
const data = await response.json();

let vehicleLogs = data.filter(log => log.numberPlate === numberPlate);
vehicleLogs = filterByDateRange(vehicleLogs, dateRange);
vehicleLogs = filterByTimeRange(vehicleLogs, timeRange);

return vehicleLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Filter by date range
function filterByDateRange(logs, range) {
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

switch(range) {
    case 'today':
        return logs.filter(log => new Date(log.timestamp) >= today);
    case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return logs.filter(log => {
            const date = new Date(log.timestamp);
            return date >= yesterday && date < today;
        });
    case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logs.filter(log => new Date(log.timestamp) >= weekAgo);
    case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return logs.filter(log => new Date(log.timestamp) >= monthAgo);
    default:
        return logs;
}
}

// Filter by time range
function filterByTimeRange(logs, range) {
if (range === 'all') return logs;

return logs.filter(log => {
    const date = new Date(log.timestamp);
    const hours = date.getHours();
    
    switch(range) {
        case 'morning':
            return hours >= 6 && hours < 12;
        case 'afternoon':
            return hours >= 12 && hours < 18;
        case 'evening':
            return hours >= 18 && hours < 24;
        case 'night':
            return hours >= 0 && hours < 6;
        default:
            return true;
    }
});
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
// Initialize map
initMap();

// Handle track button click
document.getElementById('trackBtn').addEventListener('click', () => {
    const vehicleSelect = document.getElementById('vehicleSelect');
    const dateRange = document.getElementById('dateRange').value;
    const timeRange = document.getElementById('timeRange').value;

    if (!vehicleSelect.value) {
        showError('Please select a vehicle');
        return;
    }

    loadVehicleRoute(vehicleSelect.value, dateRange, timeRange);
});

// Handle selection changes
['vehicleSelect', 'dateRange', 'timeRange'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        if (id === 'vehicleSelect') {
            document.getElementById('trackBtn').disabled = !document.getElementById(id).value;
        }
        clearMap();
    });
});
});