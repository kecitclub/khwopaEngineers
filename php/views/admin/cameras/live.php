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
          ORDER BY c.name";
$result = $conn->query($query);
$cameras = $result->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Surveillance - Traffic Information System</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="../../../assets/css/custom/style.css" rel="stylesheet">
    
    <style>
        .camera-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 1.5rem;
        }

        .camera-card {
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }

        .camera-card:hover {
            transform: translateY(-2px);
        }

        .camera-feed {
            position: relative;
            width: 100%;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
            background: #f1f5f9;
            overflow: hidden;
        }

        .camera-feed iframe,
        .camera-feed img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .camera-feed .no-feed {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #64748b;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .camera-info {
            padding: 1rem;
        }

        .camera-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .camera-title {
            font-weight: 600;
            color: #1e293b;
            margin: 0;
            font-size: 1rem;
        }

        .camera-status {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        .status-active {
            background: #dcfce7;
            color: #166534;
        }

        .status-inactive {
            background: #fee2e2;
            color: #991b1b;
        }

        .camera-details {
            font-size: 0.875rem;
            color: #64748b;
        }

        .camera-controls {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .fullscreen-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
        }

        .fullscreen-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            height: 80%;
        }

        .close-fullscreen {
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1001;
        }

        .feed-selector {
            padding: 0.5rem;
            border-radius: 0.375rem;
            border: 1px solid #e2e8f0;
            background-color: white;
            color: #1e293b;
            font-size: 0.875rem;
            width: 100%;
            margin-bottom: 0.5rem;
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
                        <li><a class="dropdown-item text-danger" href="../../includes/logout.php">
                            <i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="main-content">
            <div class="container-fluid">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Live Camera Surveillance</h4>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary" onclick="toggleLayout('grid')">
                            <i class="fas fa-th"></i>
                        </button>
                        <button class="btn btn-outline-primary" onclick="toggleLayout('list')">
                            <i class="fas fa-list"></i>
                        </button>
                        <select class="form-select" style="width: auto;" onchange="filterCameras(this.value)">
                            <option value="all">All Cameras</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                </div>

                <div class="camera-grid" id="cameraGrid">
                    <?php foreach ($cameras as $camera): ?>
                        <div class="camera-card" data-status="<?php echo $camera['status']; ?>">
                            <div class="camera-feed">
                                <?php if ($camera['status'] === 'active'): ?>
                                    <select class="feed-selector" onchange="changeFeed(this, <?php echo $camera['camid']; ?>)">
                                        <option value="">Select Demo Feed</option>
                                        <option value="https://www.youtube.com/embed/MNn9qKG2UFI">Traffic Camera 1</option>
                                        <option value="https://www.youtube.com/embed/wqctLW0Hb_0">Traffic Camera 2</option>
                                        <option value="https://www.youtube.com/embed/1EiC9bvVGnk">Traffic Camera 3</option>
                                    </select>
                                    <div class="no-feed" id="placeholder-<?php echo $camera['camid']; ?>">
                                        <i class="fas fa-video fa-3x mb-2"></i>
                                        <p>Select a demo feed</p>
                                    </div>
                                <?php else: ?>
                                    <div class="no-feed">
                                        <i class="fas fa-video-slash fa-3x mb-2"></i>
                                        <p>Camera Offline</p>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="camera-info">
                                <div class="camera-header">
                                    <h5 class="camera-title"><?php echo htmlspecialchars($camera['name'] ?? "Camera ".$camera['camid']); ?></h5>
                                    <span class="camera-status status-<?php echo $camera['status']; ?>">
                                        <?php echo ucfirst($camera['status']); ?>
                                    </span>
                                </div>
                                <div class="camera-details">
                                    <p class="mb-1">
                                        <i class="fas fa-map-marker-alt me-2"></i>
                                        <?php echo htmlspecialchars($camera['station_name'] ?? 'Unassigned'); ?>
                                    </p>
                                    <p class="mb-1">
                                        <i class="fas fa-network-wired me-2"></i>
                                        <?php echo htmlspecialchars($camera['camip']); ?>
                                    </p>
                                </div>
                                <?php if ($camera['status'] === 'active'): ?>
                                    <div class="camera-controls">
                                        <button class="btn btn-sm btn-primary w-100" onclick="viewFullscreen(<?php echo $camera['camid']; ?>)">
                                            <i class="fas fa-expand me-2"></i>Fullscreen
                                        </button>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Fullscreen Overlay -->
    <div id="fullscreenOverlay" class="fullscreen-overlay">
        <div class="fullscreen-content">
            <i class="fas fa-times close-fullscreen" onclick="closeFullscreen()"></i>
            <div id="fullscreenFeed" style="width: 100%; height: 100%;"></div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function changeFeed(select, cameraId) {
            const feedUrl = select.value;
            const placeholder = document.getElementById(`placeholder-${cameraId}`);
            const container = select.parentElement;
            
            if (feedUrl) {
                // Remove existing iframe if any
                const existingFrame = container.querySelector('iframe');
                if (existingFrame) {
                    existingFrame.remove();
                }
                
                // Create new iframe
                const iframe = document.createElement('iframe');
                iframe.src = feedUrl;
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                iframe.style.border = "0";
                
                // Add iframe and hide placeholder
                container.appendChild(iframe);
                placeholder.style.display = 'none';
            } else {
                // Remove iframe and show placeholder if no feed selected
                const iframe = container.querySelector('iframe');
                if (iframe) {
                    iframe.remove();
                }
                placeholder.style.display = 'flex';
            }
        }

        function viewFullscreen(cameraId) {
            const cameraCard = document.querySelector(`.camera-card[data-cameraid="${cameraId}"]`);
            const iframe = cameraCard.querySelector('iframe');
            
            if (iframe) {
                const fullscreenFeed = document.getElementById('fullscreenFeed');
                const clonedIframe = iframe.cloneNode(true);
                fullscreenFeed.innerHTML = '';
                fullscreenFeed.appendChild(clonedIframe);
                document.getElementById('fullscreenOverlay').style.display = 'block';
            }
        }

        function closeFullscreen() {
            document.getElementById('fullscreenOverlay').style.display = 'none';
            document.getElementById('fullscreenFeed').innerHTML = '';
        }

        function filterCameras(status) {
            const cards = document.querySelectorAll('.camera-card');
            cards.forEach(card => {
                if (status === 'all' || card.dataset.status === status) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function toggleLayout(type) {
            const grid = document.getElementById('cameraGrid');
            if (type === 'grid') {
                grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            } else {
                grid.style.gridTemplateColumns = '1fr';
            }
        }

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

        // Close fullscreen on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFullscreen();
            }
        });
    </script>
</body>
</html>