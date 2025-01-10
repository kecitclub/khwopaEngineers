import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom';

const RetriveVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVehicle, setNewVehicle] = useState({
    chasis_number: '',
    engine_number: '',
    company_name: '',
    model_number: '',
    build_year: '',
    color: '',
    cylinder_no: '',
    horse_power: '',
    seat_capacity: '',
    fuel_type: '',
    use_type: '',
    number_plate: '',
    darta_miti: ''
  });

  useEffect(() => {
    // Fetch vehicle data from the backend API
    axios.get('http://localhost:5000/vehicle')
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const tableCellStyle = {
    padding: '0px 40px',
    textAlign: 'center', // Horizontal alignment
    verticalAlign: 'middle', // Vertical alignment
  };

  const tableContainerStyle = {
    maxHeight: '400px',  
    overflowY: 'auto',  
    display: 'block',    
  };

  return (
    <div className="container mt-2 p-4">
      <h1 className="text-center mb-4">Registered vehicles</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={tableContainerStyle}> {/* Wrap table in a scrollable container */}
          <table className="table table-striped table-bordered mt-4">
            <thead className="table-primary">
              <tr>
                <th style={tableCellStyle}>Vehicle ID</th>
                <th style={tableCellStyle}>Chasis Number</th>
                <th style={tableCellStyle}>Engine Number</th>
                <th style={tableCellStyle}>Company Name</th>
                <th style={tableCellStyle}>Model Number</th>
                <th style={tableCellStyle}>Build Year</th>
                <th style={tableCellStyle}>Color</th>
                <th style={tableCellStyle}>Cylinder No</th>
                <th style={tableCellStyle}>Horse Power</th>
                <th style={tableCellStyle}>Seat Capacity</th>
                <th style={tableCellStyle}>Fuel Type</th>
                <th style={tableCellStyle}>Use Type</th>
                <th style={tableCellStyle}>Number Plate</th>
                <th style={tableCellStyle}>Darta Miti</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id}>
                  <td style={tableCellStyle}>{vehicle.vehicle_id}</td>
                  <td style={tableCellStyle}>{vehicle.chasis_number}</td>
                  <td style={tableCellStyle}>{vehicle.engine_number}</td>
                  <td style={tableCellStyle}>{vehicle.company_name}</td>
                  <td style={tableCellStyle}>{vehicle.model_number}</td>
                  <td style={tableCellStyle}>{vehicle.build_year}</td>
                  <td style={tableCellStyle}>{vehicle.color}</td>
                  <td style={tableCellStyle}>{vehicle.cylinder_no}</td>
                  <td style={tableCellStyle}>{vehicle.horse_power}</td>
                  <td style={tableCellStyle}>{vehicle.seat_capacity}</td>
                  <td style={tableCellStyle}>{vehicle.fuel_type}</td>
                  <td style={tableCellStyle}>{vehicle.use_type}</td>
                  <td style={tableCellStyle}>{vehicle.number_plate}</td>
                  <td style={tableCellStyle}>{vehicle.darta_miti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RetriveVehicle;
