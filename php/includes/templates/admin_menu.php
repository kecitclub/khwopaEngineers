<div class="sidebar" id="sidebar">
    <div class="brand">
        <i class="fas fa-shield-alt"></i>
        <span class="brand-name">TIS Admin</span>
    </div>

    <ul class="menu-list">
        <li class="menu-item">
            <a href="index.php" class="menu-link <?php echo (basename($_SERVER['PHP_SELF']) == 'index.php') ? 'active' : ''; ?>">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
            </a>
        </li>

        <li class="menu-item">
            <a href="#" class="menu-link" id="vehicleDropdown" data-bs-toggle="collapse" data-bs-target="#vehicleSubmenu" aria-expanded="false">
                <i class="fas fa-car"></i>
                <span>Vehicles</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="vehicleSubmenu">
                <a href="#" class="menu-link">
                    <i class="fas fa-plus-circle"></i>
                    <span>Register Vehicle</span>
                </a>
                <a href="#" class="menu-link">
                    <i class="fas fa-list"></i>
                    <span>Vehicle List</span>
                </a>
            </div>
        </li>

        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#cameraSubmenu" aria-expanded="false">
                <i class="fas fa-camera"></i>
                <span>Cameras</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="cameraSubmenu">
                <a href="#" class="menu-link">
                    <i class="fas fa-video"></i>
                    <span>Live Feed</span>
                </a>
                <a href="#" class="menu-link">
                    <i class="fas fa-cogs"></i>
                    <span>Settings</span>
                </a>
            </div>
        </li>

        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#reportSubmenu" aria-expanded="false">
                <i class="fas fa-chart-bar"></i>
                <span>Reports</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="reportSubmenu">
                <a href="#" class="menu-link">
                    <i class="fas fa-file-alt"></i>
                    <span>Generate Report</span>
                </a>
                <a href="#" class="menu-link">
                    <i class="fas fa-history"></i>
                    <span>View Reports</span>
                </a>
            </div>
        </li>

        <li class="menu-item">
            <a href="#" class="menu-link" data-bs-toggle="collapse" data-bs-target="#settingSubmenu" aria-expanded="false">
                <i class="fas fa-cogs"></i>
                <span>Settings</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </a>
            <div class="collapse submenu" id="settingSubmenu">
                <a href="#" class="menu-link">
                    <i class="fas fa-user-cog"></i>
                    <span>Profile</span>
                </a>
                <a href="#" class="menu-link">
                    <i class="fas fa-tools"></i>
                    <span>System</span>
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