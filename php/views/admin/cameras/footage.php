<?php
// Check if user is logged in and has admin privileges
require_once '../../../config/constants.php';
require_once '../../../config/database.php';
require_once '../../../includes/session.php';

if (!isLoggedIn() || getUserType() !== USER_ADMIN) {
    header("Location: ../../../login.php");
    exit();
}

// Get camera data
$conn = connectDB();
$query = "SELECT c.*, s.name as station_name 
          FROM camera_info c 
          LEFT JOIN stations s ON c.station_id = s.id 
          WHERE c.status = 'active'
          ORDER BY c.name";
$result = $conn->query($query);
$cameras = $result->fetch_all(MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Footage Control - Traffic Information System</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="../../../assets/css/custom/style.css" rel="stylesheet">
    
    <style>
        .footage-container {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .footage-viewer {
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            width: 100%;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }
        
        .footage-viewer iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .footage-controls {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .date-selector {
            padding: 20px;
            background: white;
            border-radius: 10px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <!-- Include admin menu -->
    <?php include '../../../includes/templates/admin_menu.php'; ?>

    <!-- Main Content -->
    <div class="main-wrapper">
        <!-- Top header -->
        <div class="top-header">
            <div class="hamburger">
                <i class="fas fa-bars"></i>
            </div>
            <div class="user-profile">
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle text-primary" style="font-size: 2rem;"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Settings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="../../../includes/logout.php">
                            <i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="main-content">
            <div class="container-fluid">
                <h4 class="mb-4">Footage Control</h4>

                <!-- Date and Camera Selection -->
                <div class="date-selector">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="form-label">Select Camera</label>
                                <select class="form-select" id="cameraSelect">
                                    <option value="">Choose Camera</option>
                                    <?php foreach ($cameras as $camera): ?>
                                        <option value="<?php echo $camera['camid']; ?>">
                                            <?php echo htmlspecialchars($camera['name'] ?? "Camera ".$camera['camid']); ?>
                                            (<?php echo htmlspecialchars($camera['station_name'] ?? 'Unassigned'); ?>)
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="form-label">Date</label>
                                <input type="date" class="form-control" id="footageDate">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="form-label">Time</label>
                                <input type="time" class="form-control" id="footageTime">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footage Viewer -->
                <div class="footage-container">
                    <div class="footage-viewer" id="footageViewer">
                        <!-- For demo purposes, using a YouTube video -->
                        <div class="text-center p-5">
                            <i class="fas fa-film fa-3x mb-3 text-secondary"></i>
                            <h5 class="text-secondary">Select a camera and date to view footage</h5>
                        </div>
                    </div>

                    <!-- Playback Controls -->
                    <div class="footage-controls">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <div class="btn-group">
                                    <button class="btn btn-outline-primary" onclick="playFootage()">
                                        <i class="fas fa-play"></i>
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="pauseFootage()">
                                        <i class="fas fa-pause"></i>
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="stopFootage()">
                                        <i class="fas fa-stop"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6 text-end">
                                <button class="btn btn-primary" onclick="downloadFootage()">
                                    <i class="fas fa-download me-2"></i>Download Footage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // For demo purposes, we'll use some example footage
        const demoFootage = {
            1: "https://www.youtube.com/embed/AdUw5RdyZxI",
            2: "https://www.youtube.com/embed/wqctLW0Hb_0",
            3: "https://www.youtube.com/embed/1EiC9bvVGnk"
        };

        document.getElementById('cameraSelect').addEventListener('change', function() {
            const footageUrl = demoFootage[this.value];
            const viewer = document.getElementById('footageViewer');
            
            if (footageUrl) {
                viewer.innerHTML = `<iframe src="${footageUrl}" allowfullscreen></iframe>`;
            } else {
                viewer.innerHTML = `
                    <div class="text-center p-5">
                        <i class="fas fa-film fa-3x mb-3 text-secondary"></i>
                        <h5 class="text-secondary">Select a camera and date to view footage</h5>
                    </div>`;
            }
        });

        // Initialize hamburger menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.querySelector('.hamburger');
            const sidebar = document.querySelector('.sidebar');
            const mainWrapper = document.querySelector('.main-wrapper');
            
            if (hamburger && sidebar && mainWrapper) {
                hamburger.addEventListener('click', function() {
                    sidebar.classList.toggle('collapsed');
                    mainWrapper.classList.toggle('expanded');
                });
            }
        });

        // Placeholder functions for controls
        function playFootage() {
            alert('Play functionality would be implemented here');
        }

        function pauseFootage() {
            alert('Pause functionality would be implemented here');
        }

        function stopFootage() {
            alert('Stop functionality would be implemented here');
        }

        function downloadFootage() {
            alert('Download functionality would be implemented here');
        }
    </script>
</body>
</html>