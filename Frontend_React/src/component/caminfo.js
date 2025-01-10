import React, { useState } from 'react';
import './combine.css';
import CameraForm from './camform'; // New Component
import SubmitButton from './submitbutton';

function CameraFormPage() {
  const [cameraInfo, setCameraInfo] = useState({
    camip: '',
    latitude: '',
    longitude: '',
    angle_reference_to_north: '',
    station_id: '' // The station_id will link to the station_info table in the database
  });

  const handleCameraChange = (e) => {
    const { name, value } = e.target;
    setCameraInfo({
      ...cameraInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Capture camera information
    const combinedData = {
      cameraInfo
    };
    console.log('Camera Data Submitted:', combinedData);
    alert('Camera form submitted successfully!');
    // Add your API call or database logic here to insert into camera_info table
  };

  return (
    <>    <div className="form-container">
      <h2>Camera Information</h2>
      <form onSubmit={handleSubmit}>
        <CameraForm cameraInfo={cameraInfo} handleCameraChange={handleCameraChange} /> {/* Camera Form */}
        <SubmitButton />
      </form>
    </div>
    </>
  );
}

export default CameraFormPage;
