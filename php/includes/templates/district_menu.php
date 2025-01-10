<?php
// Get current page for active menu highlighting
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<div class="sidebar" id="sidebar">
    <div class="brand">
        <i class="fas fa-building"></i>
        <span class="brand-name">District Control</span>
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
                <a href="views/district/dashboard/realtime.php" class="menu-link">
                    <i class="fas fa-chart-line"></i>
                    <span>Real-Time Monitor</span>
                </a>
                <a href="views/district/dashboard/alerts.php" class="menu-link">
                    <i class="fas fa-bell"></i>
                    <span>Alert Center</span>
                </a>
                <a href="views/district/dashboard/analysis.php" class="menu-link">
                    <i class="fas fa-chart-bar"></i>
                    <span>District Analysis</span>
                </a>
            </div>
        </li>

        <!-- Stations -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#stationsSubmenu" aria-expanded="false">
                <i class="fas fa-traffic-light"></i>
                <span>Stations</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="stationsSubmenu">
                <a href="views/district/stations/overview.php" class="menu-link">
                    <i class="fas fa-th-large"></i>
                    <span>Station Overview</span>
                </a>
                <a href="views/district/stations/status.php" class="menu-link">
                    <i class="fas fa-server"></i>
                    <span>Station Status</span>
                </a>
                <a href="views/district/stations/performance.php" class="menu-link">
                    <i class="fas fa-chart-pie"></i>
                    <span>Performance Monitor</span>
                </a>
            </div>
        </li>

        <!-- Vehicles -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#vehiclesSubmenu" aria-expanded="false">
                <i class="fas fa-ambulance"></i>
                <span>Vehicles</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="vehiclesSubmenu">
                <a href="views/district/vehicles/emergency.php" class="menu-link">
                    <i class="fas fa-first-aid"></i>
                    <span>Emergency Vehicles</span>
                </a>
                <a href="views/district/vehicles/search.php" class="menu-link">
                    <i class="fas fa-search"></i>
                    <span>Vehicle Search</span>
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
                <a href="views/district/tracking/live.php" class="menu-link">
                    <i class="fas fa-satellite"></i>
                    <span>District Live Monitor</span>
                </a>
                <a href="views/district/tracking/playback.php" class="menu-link">
                    <i class="fas fa-history"></i>
                    <span>Journey Playback</span>
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
                <a href="views/district/cameras/surveillance.php" class="menu-link">
                    <i class="fas fa-camera"></i>
                    <span>District Surveillance</span>
                </a>
                <a href="views/district/cameras/stations.php" class="menu-link">
                    <i class="fas fa-video-slash"></i>
                    <span>Station Cameras</span>
                </a>
                <a href="views/district/cameras/footage.php" class="menu-link">
                    <i class="fas fa-film"></i>
                    <span>Footage Access</span>
                </a>
                <a href="views/district/cameras/coverage.php" class="menu-link">
                    <i class="fas fa-map"></i>
                    <span>District Coverage</span>
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
                <a href="views/district/reports/district.php" class="menu-link">
                    <i class="fas fa-file-contract"></i>
                    <span>District Reports</span>
                </a>
                <a href="views/district/reports/stations.php" class="menu-link">
                    <i class="fas fa-file-medical-alt"></i>
                    <span>Station Reports</span>
                </a>
                <a href="views/district/reports/analysis.php" class="menu-link">
                    <i class="fas fa-chart-line"></i>
                    <span>Analysis Tools</span>
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
                <a href="views/district/violations/list.php" class="menu-link">
                    <i class="fas fa-list"></i>
                    <span>District Violations</span>
                </a>
                <a href="views/district/violations/hotspots.php" class="menu-link">
                    <i class="fas fa-fire"></i>
                    <span>Violation Hotspots</span>
                </a>
                <a href="views/district/violations/performance.php" class="menu-link">
                    <i class="fas fa-chart-bar"></i>
                    <span>Station Performance</span>
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