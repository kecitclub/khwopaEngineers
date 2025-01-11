import React, { useState } from 'react';
import './combine.css';
import CameraForm from './camform'; // Camera form component
import SubmitButton from './submitbutton'; // Submit button component

function CameraFormPage() {
  const [cameraInfo, setCameraInfo] = useState({
    camip: '',
    name: '',
    latitude: '',
    longitude: '',
    angle_reference_to_north: '',
    station_id: '',
    status: '',
    type: '',
    installed_date: '',
    last_maintenance: '',
    resolution: '',
  });

  const handleCameraChange = (e) => {
    const { name, value } = e.target;
    setCameraInfo({
      ...cameraInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/create-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cameraInfo), // Send cameraInfo directly
      });

      const data = await response.json();
      if (response.ok) {
        alert('Camera form submitted successfully!');
      } else {
        console.error('Error from server:', data.message);
        alert('Error submitting form: ' + data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred!');
    }
  };

  return (
    <div className="form-container">
      <h2>Camera Information</h2>
      <form onSubmit={handleSubmit}>
        <CameraForm cameraInfo={cameraInfo} handleCameraChange={handleCameraChange} />
        <SubmitButton />
      </form>
    </div>
  );
}

export default CameraFormPage;
