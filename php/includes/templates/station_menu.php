<?php
// Get current page for active menu highlighting
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<div class="sidebar" id="sidebar">
    <div class="brand">
        <i class="fas fa-traffic-light"></i>
        <span class="brand-name">Station Control</span>
    </div>
    
    <ul class="menu-list">
        <!-- Dashboard -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#dashboardSubmenu" aria-expanded="false">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="dashboardSubmenu">
                <a href="views/station/dashboard/realtime.php" class="menu-link">
                    <i class="fas fa-chart-line"></i>
                    <span>Real-Time Monitor</span>
                </a>
                <a href="views/station/dashboard/alerts.php" class="menu-link">
                    <i class="fas fa-bell"></i>
                    <span>Alert Center</span>
                </a>
                <a href="views/station/dashboard/analysis.php" class="menu-link">
                    <i class="fas fa-chart-bar"></i>
                    <span>Station Analysis</span>
                </a>
            </div>
        </li>

        <!-- Operations -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#operationsSubmenu" aria-expanded="false">
                <i class="fas fa-cogs"></i>
                <span>Operations</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="operationsSubmenu">
                <a href="views/station/operations/status.php" class="menu-link">
                    <i class="fas fa-road"></i>
                    <span>Traffic Status</span>
                </a>
                <a href="views/station/operations/equipment.php" class="menu-link">
                    <i class="fas fa-tools"></i>
                    <span>Equipment Health</span>
                </a>
                <a href="views/station/operations/metrics.php" class="menu-link">
                    <i class="fas fa-chart-pie"></i>
                    <span>Performance Metrics</span>
                </a>
            </div>
        </li>

        <!-- Vehicles -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#vehiclesSubmenu" aria-expanded="false">
                <i class="fas fa-car"></i>
                <span>Vehicles</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="vehiclesSubmenu">
                <a href="views/station/vehicles/emergency.php" class="menu-link">
                    <i class="fas fa-ambulance"></i>
                    <span>Emergency Detection</span>
                </a>
                <a href="views/station/vehicles/search.php" class="menu-link">
                    <i class="fas fa-search"></i>
                    <span>Vehicle Search</span>
                </a>
                <a href="views/station/vehicles/recent.php" class="menu-link">
                    <i class="fas fa-history"></i>
                    <span>Recent Detections</span>
                </a>
            </div>
        </li>

        <!-- Tracking -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#trackingSubmenu" aria-expanded="false">
                <i class="fas fa-map-marker-alt"></i>
                <span>Tracking</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="trackingSubmenu">
                <a href="views/station/tracking/junction.php" class="menu-link">
                    <i class="fas fa-crosshairs"></i>
                    <span>Junction Monitor</span>
                </a>
                <a href="views/station/tracking/history.php" class="menu-link">
                    <i class="fas fa-history"></i>
                    <span>Vehicle History</span>
                </a>
                <a href="views/station/tracking/routes.php" class="menu-link">
                    <i class="fas fa-route"></i>
                    <span>Route Recording</span>
                </a>
            </div>
        </li>

        <!-- Cameras -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#camerasSubmenu" aria-expanded="false">
                <i class="fas fa-video"></i>
                <span>Cameras</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="camerasSubmenu">
                <a href="views/station/cameras/live.php" class="menu-link">
                    <i class="fas fa-play-circle"></i>
                    <span>Live Feed</span>
                </a>
                <a href="views/station/cameras/footage.php" class="menu-link">
                    <i class="fas fa-clock"></i>
                    <span>Quick Footage</span>
                </a>
                <a href="views/station/cameras/coverage.php" class="menu-link">
                    <i class="fas fa-map-marked-alt"></i>
                    <span>Coverage View</span>
                </a>
            </div>
        </li>

        <!-- Reports -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#reportsSubmenu" aria-expanded="false">
                <i class="fas fa-file-alt"></i>
                <span>Reports</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="reportsSubmenu">
                <a href="views/station/reports/station.php" class="menu-link">
                    <i class="fas fa-file"></i>
                    <span>Station Reports</span>
                </a>
                <a href="views/station/reports/incidents.php" class="menu-link">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Incident Logs</span>
                </a>
                <a href="views/station/reports/daily.php" class="menu-link">
                    <i class="fas fa-calendar-day"></i>
                    <span>Daily Summary</span>
                </a>
            </div>
        </li>

        <!-- Violations -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#violationsSubmenu" aria-expanded="false">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Violations</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="violationsSubmenu">
                <a href="views/station/violations/speed.php" class="menu-link">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Speed Detection</span>
                </a>
                <a href="views/station/violations/parking.php" class="menu-link">
                    <i class="fas fa-parking"></i>
                    <span>Parking Monitor</span>
                </a>
                <a href="views/station/violations/records.php" class="menu-link">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Violation Records</span>
                </a>
            </div>
        </li>
    </ul>

    <div class="menu-bottom">
        <a href="includes/logout.php" class="menu-link">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
        </a>
    </div>
</div>