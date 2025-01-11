<?php
// Base paths
define('BASE_PATH', dirname(__DIR__));
define('INCLUDES_PATH', BASE_PATH . '/includes');
define('MODULES_PATH', INCLUDES_PATH . '/modules');
define('VIEWS_PATH', BASE_PATH . '/views');
define('ASSETS_PATH', BASE_PATH . '/assets');

// User types
define('USER_ADMIN', 'admin');
define('USER_DISTRICT', 'district');
define('USER_STATION', 'station');

// Session keys
define('SESSION_USER_ID', 'user_id');
define('SESSION_USER_TYPE', 'user_type');
define('SESSION_USERNAME', 'username');
define('SESSION_FULL_NAME', 'full_name');
define('SESSION_DISTRICT_ID', 'district_id');
define('SESSION_STATION_ID', 'station_id');