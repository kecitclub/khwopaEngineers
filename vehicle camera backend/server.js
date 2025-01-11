const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection pool setup
const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
  waitForConnections: true,  // Allow the pool to wait for a connection
  connectionLimit: 10,       // Set a limit for the pool size (adjust based on usage)
  queueLimit: 0              // No limit on waiting for a connection
});

// Test connection to the database
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database");
  connection.release(); // Release the connection back to the pool
});

// VEHICLE ROUTES

// Fetch all vehicles from the database
app.get("/vehicles", (req, res) => {
  const query = "SELECT * FROM vehicle_info"; // Fetch all vehicle data from the database

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching vehicles:", err.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching vehicles"
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Fetch a vehicle by ID
app.get("/vehicle/:id", (req, res) => {
  const vehicleId = req.params.id;
  console.log(`Fetching vehicle data for vehicle ID: ${vehicleId}`);
  const query = "SELECT * FROM vehicle_info WHERE vehicle_id = ?";

  db.query(query, [vehicleId], (err, results) => {
    if (err) {
      console.error("Error fetching vehicle data:", err.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching vehicle data"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Add a new vehicle (with owner information)
app.post('/create-vehicle', (req, res) => {
  const {
    vehicleInfo,
  } = req.body;

  console.log('Incoming data:', req.body);

  const {
    chasis_number,
    engine_number,
    company_name,
    model_number,
    build_year,
    color,
    cylinder_no,
    horse_power,
    seat_capacity,
    fuel_type,
    use_type,
    number_plate,
    darta_miti,
    owner_name,
    owner_location,
  } = vehicleInfo;

  const vehicleQuery = `
    INSERT INTO vehicle_info (chasis_number, engine_number, company_name, model_number, build_year, color, cylinder_no, horse_power, seat_capacity, fuel_type, use_type, number_plate, darta_miti, owner_name, owner_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)
  `;

  db.query(
    vehicleQuery,
    [
      chasis_number,
      engine_number,
      company_name,
      model_number,
      build_year,
      color,
      cylinder_no,
      horse_power,
      seat_capacity,
      fuel_type,
      use_type,
      number_plate,
      darta_miti,
      owner_name,
      owner_location,
    ],
    (err, results) => {
      if (err) {
        console.error('Error adding vehicle:', err);
        res.status(500).json({ message: 'Error adding vehicle' });
      } else {
        res.json({ message: 'Vehicle and Owner added successfully' });
      }
    }
  );
});

// Update vehicle and owner information
app.put('/vehicle/update-vehicle/:id', (req, res) => {
  console.log("Incoming request body:", req.body);

  const vehicleId = req.params.id;
  const {
    chasis_number,
    engine_number,
    company_name,
    model_number,
    build_year,
    color,
    cylinder_no,
    horse_power,
    seat_capacity,
    fuel_type,
    use_type,
    number_plate,
    darta_miti,
    owner_name,
    owner_location,
  } = req.body;

  const vehicleQuery = `
    UPDATE vehicle_info
    SET chasis_number = ?, engine_number = ?, company_name = ?, model_number = ?, build_year = ?, color = ?, cylinder_no = ?, horse_power = ?, seat_capacity = ?, fuel_type = ?, use_type = ?, number_plate = ?, darta_miti = ?, owner_name=?, owner_location=?
    WHERE vehicle_id = ?
  `;

  db.query(
    vehicleQuery,
    [
      chasis_number,
      engine_number,
      company_name,
      model_number,
      build_year,
      color,
      cylinder_no,
      horse_power,
      seat_capacity,
      fuel_type,
      use_type,
      number_plate,
      darta_miti,
      owner_name,
      owner_location,
      vehicleId
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating vehicle:", err.message);
        return res.status(500).json({ success: false, message: "Error updating Vehicle" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Vehicle not found" });
      }

      res.json({ success: true, message: "Vehicle updated successfully" });
    }
  );
});

// CAMERA ROUTES

// Fetch a camera by ID
app.get("/camera/:id", (req, res) => {
  const camid = req.params.id;
  console.log(`Fetching camera data for camera ID: ${camid}`);
  const query = "SELECT * FROM camera_info WHERE camid = ?";

  db.query(query, [camid], (err, results) => {
    if (err) {
      console.error("Error fetching camera data:", err.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching camera data"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found"
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Update camera information
app.put("/camera/update-camera/:id", (req, res) => {
  const camid = req.params.id;
  const { camip, name, latitude, longitude, angle_reference_to_north, station_id, status, type, installed_date, last_maintenance, resolution } = req.body;

  const query = `
    UPDATE camera_info
    SET camip = ?, name = ?, latitude = ?, longitude = ?, angle_reference_to_north = ?, station_id = ?, status = ?, type = ?, installed_date = ?, last_maintenance = ?, resolution = ?
    WHERE camid = ?
  `;

  db.query(query, [camip, name, latitude, longitude, angle_reference_to_north, station_id, status, type, installed_date, last_maintenance, resolution, camid], (err, results) => {
    if (err) {
      console.error("Error updating camera:", err.message);
      return res.status(500).json({ success: false, message: "Error updating camera" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Camera not found" });
    }
    res.json({ success: true, message: "Camera updated successfully" });
  });
});

// Fetch all cameras
app.get("/camera", (req, res) => {
  const query = "SELECT * FROM camera_info";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ success: false, message: "Error fetching data" });
    }
    res.json({ success: true, data: results });
  });
});

// Add a new camera
app.post("/create-camera", (req, res) => {
  const { camip, name, latitude, longitude, angle_reference_to_north, station_id, status, type, installed_date, last_maintenance, resolution } = req.body;

  const query = `
    INSERT INTO camera_info (camip, name, latitude, longitude, angle_reference_to_north, station_id, status, type, installed_date, last_maintenance, resolution)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [camip, name, latitude, longitude, angle_reference_to_north, station_id, status, type, installed_date, last_maintenance, resolution], (err) => {
    if (err) {
      console.error("Error adding camera:", err.message);
      return res.status(500).json({ success: false, message: "Error adding camera" });
    }
    res.json({ success: true, message: "Camera added successfully" });
  });
});

// DELETE a camera by ID
app.delete("/camera/delete-camera/:id", (req, res) => {
  const cameraId = req.params.id;
  console.log(`Deleting camera with ID: ${cameraId}`);
  
  const query = "DELETE FROM camera_info WHERE camid = ?";
  
  db.query(query, [cameraId], (err, results) => {
    if (err) {
      console.error("Error deleting camera:", err.message);
      return res.status(500).json({ success: false, message: "Error deleting camera" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Camera not found" });
    }

    res.json({ success: true, message: "Camera deleted successfully" });
  });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});
