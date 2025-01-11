import React, { useState } from 'react';
import './combine.css';
import VehicleForm from './vehicleform';
import SubmitButton from './submitbutton';

function VehicleOwnerForm() {
  const [vehicleInfo, setVehicleInfo] = useState({
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
    darta_miti: '',
    owner_name: '',
    owner_location: ''
  });

  // Handle changes for both vehicle and owner fields
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo({
      ...vehicleInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparing data for submission
    const combinedData = {
      vehicleInfo
    };

    console.log('Form Data Submitted:', combinedData); // Debug the data here

    try {
      const response = await fetch('http://localhost:5000/create-vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(combinedData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Form submitted successfully!');
      } else {
        alert('Error submitting form!', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network Error Occurred!');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <VehicleForm vehicleInfo={vehicleInfo} handleVehicleChange={handleVehicleChange} />
        <SubmitButton />
      </form>
    </div>
  );
}

export default VehicleOwnerForm;
