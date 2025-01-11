import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  // Fetch vehicle data when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/vehicles')
      .then(response => {
        setVehicles(response.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vehicle data:', err);
        setError('Failed to fetch vehicle data');
        setLoading(false);
      });
  }, []);

  const openModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="overlay">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className='text-center'>Vehicle Information</h2>
      <div
        className="table-responsive"
        style={{
          height: "80vh", // Fixed height to 80% of viewport height
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Chasis Number</th>
            <th>Engine Number</th>
            <th>Company Name</th>
            <th>Model Number</th>
            <th>Build Year</th>
            <th>Color</th>
            <th>Cylinder No</th>
            <th>Horse Power</th>
            <th>Seat Capacity</th>
            <th>Fuel Type</th>
            <th>Use Type</th>
            <th>Number Plate</th>
            <th>Darta Miti</th>
            <th>Owner Name</th>
            <th>Owner Location</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.vehicle_id} onClick={() => openModal(vehicle)}>
              <td>{vehicle.chasis_number}</td>
              <td>{vehicle.engine_number}</td>
              <td>{vehicle.company_name}</td>
              <td>{vehicle.model_number}</td>
              <td>{vehicle.build_year}</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.cylinder_no}</td>
              <td>{vehicle.horse_power}</td>
              <td>{vehicle.seat_capacity}</td>
              <td>{vehicle.fuel_type}</td>
              <td>{vehicle.use_type}</td>
              <td>{vehicle.number_plate}</td>
              <td>{vehicle.darta_miti}</td>
              <td>{vehicle.owner_name}</td>
              <td>{vehicle.owner_location}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default VehicleTable;
