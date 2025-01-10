<div class="l-navbar" id="nav-bar">
    <nav class="nav">
        <div>
            <a href="index.php" class="nav_logo">
                <i class='bx bx-layer nav_logo-icon'></i>
                <span class="nav_logo-name">TIS District</span>
            </a>
            <div class="nav_list">
                <a href="index.php" class="nav_link active">
                    <i class='bx bx-grid-alt nav_icon'></i>
                    <span class="nav_name">Dashboard</span>
                </a>
                
                <!-- Station Management -->
                <a href="#" class="nav_link" data-bs-toggle="collapse" data-bs-target="#stationSubmenu">
                    <i class='bx bx-building nav_icon'></i>
                    <span class="nav_name">Stations</span>
                    <i class='bx bx-plus menu-arrow'></i>
                </a>
                <div class="collapse" id="stationSubmenu">
                    <a href="views/district/stations/list.php" class="nav_link pl-4">
                        <i class='bx bx-list-ul nav_icon'></i>
                        <span class="nav_name">Station List</span>
                    </a>
                    <a href="views/district/stations/cameras.php" class="nav_link pl-4">
                        <i class='bx bx-camera nav_icon'></i>
                        <span class="nav_name">Camera Status</span>
                    </a>
                </div>

                <!-- Vehicle Tracking -->
                <a href="#" class="nav_link" data-bs-toggle="collapse" data-bs-target="#trackingSubmenu">
                    <i class='bx bx-map nav_icon'></i>
                    <span class="nav_name">Tracking</span>
                    <i class='bx bx-plus menu-arrow'></i>
                </a>
                <div class="collapse" id="trackingSubmenu">
                    <a href="views/district/tracking/live.php" class="nav_link pl-4">
                        <i class='bx bx-current-location nav_icon'></i>
                        <span class="nav_name">Live Tracking</span>
                    </a>
                    <a href="views/district/tracking/history.php" class="nav_link pl-4">
                        <i class='bx bx-history nav_icon'></i>
                        <span class="nav_name">Track History</span>
                    </a>
                </div>

                <!-- Reports -->
                <a href="#" class="nav_link" data-bs-toggle="collapse" data-bs-target="#reportsSubmenu">
                    <i class='bx bx-file nav_icon'></i>
                    <span class="nav_name">Reports</span>
                    <i class='bx bx-plus menu-arrow'></i>
                </a>
                <div class="collapse" id="reportsSubmenu">
                    <a href="views/district/reports/generate.php" class="nav_link pl-4">
                        <i class='bx bx-plus-circle nav_icon'></i>
                        <span class="nav_name">Create Report</span>
                    </a>
                    <a href="views/district/reports/view.php" class="nav_link pl-4">
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