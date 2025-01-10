<div class="l-navbar" id="nav-bar">
    <nav class="nav">
        <div>
            <a href="index.php" class="nav_logo">
                <i class='bx bx-layer nav_logo-icon'></i>
                <span class="nav_logo-name">TIS Station</span>
            </a>
            <div class="nav_list">
                <a href="index.php" class="nav_link active">
                    <i class='bx bx-grid-alt nav_icon'></i>
                    <span class="nav_name">Dashboard</span>
                </a>

                <!-- Camera Management -->
                <a href="#" class="nav_link" data-bs-toggle="collapse" data-bs-target="#cameraSubmenu">
                    <i class='bx bx-camera nav_icon'></i>
                    <span class="nav_name">Cameras</span>
                    <i class='bx bx-plus menu-arrow'></i>
                </a>
                <div class="collapse" id="cameraSubmenu">
                    <a href="views/station/cameras/status.php" class="nav_link pl-4">
                        <i class='bx bx-video nav_icon'></i>
                        <span class="nav_name">Live Status</span>
                    </a>
                    <a href="views/station/cameras/logs.php" class="nav_link pl-4">
                        <i class='bx bx-history nav_icon'></i>
                        <span class="nav_name">Camera Logs</span>
                    </a>
                </div>

                <!-- Vehicle Detection -->
                <a href="#" class="nav_link" data-bs-toggle="collapse" data-bs-target="#detectionSubmenu">
                    <i class='bx bx-car nav_icon'></i>
                    <span class="nav_name">Detection</span>
                    <i class='bx bx-plus menu-arrow'></i>
                </a>
                <div class="collapse" id="detectionSubmenu">
                    <a href="views/station/detection/live.php" class="nav_link pl-4">
                        <i class='bx bx-current-location nav_icon'></i>
                        <span class="nav_name">Live Detection</span>
                    </a>
                    <a href="views/station/detection/logs.php" class="nav_link pl-4">
                        <i class='bx bx-list-ul nav_icon'></i>
                        <span class="nav_name">Detection Logs</span>
                    </a>
                </div>

                <!-- Reports -->
                <a href="#" class="nav_link" data-bs-toggle="collapse" data-bs-target="#reportsSubmenu">
                    <i class='bx bx-file nav_icon'></i>
                    <span class="nav_name">Reports</span>
                    <i class='bx bx-plus menu-arrow'></i>
                </a>
                <div class="collapse" id="reportsSubmenu">
                    <a href="views/station/reports/create.php" class="nav_link pl-4">
                        <i class='bx bx-plus-circle nav_icon'></i>
                        <span class="nav_name">Create Report</span>
                    </a>
                    <a href="views/station/reports/list.php" class="nav_link pl-4">
                        <i class='bx bx-list-ul nav_icon'></i>
                        <span class="nav_name">View Reports</span>
                    </a>
                </div>
            </div>
        </div>
        <a href="includes/logout.php" class="nav_link">
            <i class='bx bx-log-out nav_icon'></i>
            <span class="nav_name">Sign Out</span>
        </a>
    </nav>
</div>