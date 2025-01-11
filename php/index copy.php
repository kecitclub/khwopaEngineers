<?php
require_once 'config/constants.php';
require_once 'includes/session.php';
require_once 'config/database.php';

if (!isLoggedIn()) {
    header("Location: login.php");
    exit();
}

$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Information System</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/custom/style.css" rel="stylesheet">
</head>
<body>
    <!-- Include appropriate menu based on user type -->
    <?php
    switch($currentUser['user_type']) {
        case USER_ADMIN:
            include 'includes/templates/admin_menu.php';
            break;
        case USER_DISTRICT:
            include 'includes/templates/district_menu.php';
            break;
        case USER_STATION:
            include 'includes/templates/station_menu.php';
            break;
        default:
            // Log unauthorized access attempt
            error_log("Unauthorized user type detected: " . $currentUser['user_type']);
            header("Location: unauthorized.php");
            exit();
    }
    ?>

    <!-- Main content wrapper -->
    <div class="main-wrapper">
        <!-- Top header -->
        <div class="top-header">
            <div class="hamburger">
                <i class="fas fa-bars"></i>
            </div>
            <div class="user-profile">
                <div class="user-info">
                    <p class="user-name"><?php echo htmlspecialchars($currentUser['full_name']); ?></p>
                    <p class="user-role"><?php 
                        switch($currentUser['user_type']) {
                            case USER_ADMIN:
                                echo 'System Administrator';
                                break;
                            case USER_DISTRICT:
                                echo 'District Controller';
                                break;
                            case USER_STATION:
                                echo 'Station Operator';
                                break;
                            default:
                                echo 'User';
                        }
                    ?></p>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle text-primary" style="font-size: 2.5rem;"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Settings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="includes/logout.php">
                            <i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="main-content">
            <?php
            // Include dashboard based on user type
            switch($currentUser['user_type']) {
                case USER_ADMIN:
                    include "views/admin/dashboard.php";
                    break;
                case USER_DISTRICT:
                    include "views/district/dashboard.php";
                    break;
                case USER_STATION:
                    include "views/station/dashboard.php";
                    break;
            }
            ?>
        </div>
    </div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/custom/script.js"></script>
</body>
</html>