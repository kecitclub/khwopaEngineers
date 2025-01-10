import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom';

const DefaultVehicle = () => {
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

//   const handleDelete = (vehicleId) => {
//     axios.delete(`http://localhost:5000/delete-vehicle/${vehicleId}`)
//       .then(() => {
//         alert('Vehicle deleted successfully!');
//         setVehicles(vehicles.filter(vehicle => vehicle.vehicle_id !== vehicleId));
//       })
//       .catch(error => {
//         console.error('Error deleting vehicle:', error);
//         alert('Error deleting vehicle');
//       });
//   };

//   const handleUpdate = (vehicleId) => {
//     // Prepare updated vehicle data (for simplicity, hardcoding a sample update)
//     const updatedVehicle = { ...newVehicle, build_year: 2022 };
//     axios.put(`http://localhost:5000/update-vehicle/${vehicleId}`, updatedVehicle)
//       .then(() => {
//         alert('Vehicle updated successfully!');
//         setVehicles(vehicles.map(vehicle => vehicle.vehicle_id === vehicleId ? { ...vehicle, ...updatedVehicle } : vehicle));
//       })
//       .catch(error => {
//         console.error('Error updating vehicle:', error);
//         alert('Error updating vehicle');
//       });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewVehicle({
//       ...newVehicle,
//       [name]: value
//     });
//   };

  // Define the styles using constants
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
      <h1 className="text-center mb-5">Vehicle Information</h1>
      
      <div className="d-flex justify-content-center mb-4">
        <Link to="/vehicle/create-vehicle" className="btn btn-success me-3 w-25">Create</Link>
        <Link to="/vehicle/create-vehicle" className="btn btn-warning me-3 w-25">Update</Link>
        <Link to="/vehicle/create-vehicle" className="btn btn-danger me-3 w-25">Delete</Link>
        </div>
    </div>
  );
};

export default DefaultVehicle;
