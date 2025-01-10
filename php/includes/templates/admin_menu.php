<?php
// Get current page for active menu highlighting
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<div class="sidebar" id="sidebar">
    <div class="brand">
        <i class="fas fa-shield-alt"></i>
        <span class="brand-name">Administration</span>
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
                <a href="views/admin/dashboard/realtime.php" class="menu-link">
                    <i class="fas fa-chart-line"></i>
                    <span>Real-Time Monitor</span>
                </a>
                <a href="views/admin/dashboard/alerts.php" class="menu-link">
                    <i class="fas fa-bell"></i>
                    <span>Alert Center</span>
                </a>
                <a href="views/admin/dashboard/analysis.php" class="menu-link">
                    <i class="fas fa-chart-bar"></i>
                    <span>Historical Analysis</span>
                </a>
            </div>
        </li>

        <!-- Vehicles -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#vehicleSubmenu" aria-expanded="false">
                <i class="fas fa-car"></i>
                <span>Vehicles</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="vehicleSubmenu">
                <a href="views/admin/vehicles/register.php" class="menu-link">
                    <i class="fas fa-plus-circle"></i>
                    <span>Vehicle Registration</span>
                </a>
                <a href="views/admin/vehicles/database.php" class="menu-link">
                    <i class="fas fa-database"></i>
                    <span>Vehicle Database</span>
                </a>
                <a href="views/admin/vehicles/categories.php" class="menu-link">
                    <i class="fas fa-tags"></i>
                    <span>Vehicle Categories</span>
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
                <a href="views/admin/tracking/live.php" class="menu-link">
                    <i class="fas fa-satellite"></i>
                    <span>Live Monitor</span>
                </a>
                <a href="views/admin/tracking/playback.php" class="menu-link">
                    <i class="fas fa-history"></i>
                    <span>Journey Playback</span>
                </a>
            </div>
        </li>

        <!-- Cameras -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#cameraSubmenu" aria-expanded="false">
                <i class="fas fa-video"></i>
                <span>Cameras</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="cameraSubmenu">
                <a href="views/admin/cameras/live.php" class="menu-link">
                    <i class="fas fa-camera"></i>
                    <span>Live Surveillance</span>
                </a>
                <a href="views/admin/cameras/manage.php" class="menu-link">
                    <i class="fas fa-cogs"></i>
                    <span>Camera Management</span>
                </a>
                <a href="views/admin/cameras/footage.php" class="menu-link">
                    <i class="fas fa-film"></i>
                    <span>Footage Control</span>
                </a>
                <a href="views/admin/cameras/map.php" class="menu-link">
                    <i class="fas fa-map"></i>
                    <span>Camera Map</span>
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
                <a href="views/admin/reports/manage.php" class="menu-link">
                    <i class="fas fa-tasks"></i>
                    <span>Report Management</span>
                </a>
            </div>
        </li>

        <!-- User Management -->
        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#userSubmenu" aria-expanded="false">
                <i class="fas fa-users"></i>
                <span>User Management</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="userSubmenu">
                <a href="views/admin/users/register.php" class="menu-link">
                    <i class="fas fa-user-plus"></i>
                    <span>User Registration</span>
                </a>
                <a href="views/admin/users/manage.php" class="menu-link">
                    <i class="fas fa-user-cog"></i>
                    <span>Manage Users</span>
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
                <a href="views/admin/violations/speed.php" class="menu-link">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Speed Monitoring</span>
                </a>
                <a href="views/admin/violations/parking.php" class="menu-link">
                    <i class="fas fa-parking"></i>
                    <span>Parking Control</span>
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