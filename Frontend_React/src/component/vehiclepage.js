import React, { useState } from 'react';
import './combine.css';
import VehicleForm from './vehicleform';
import OwnerForm from './ownerfoem';
import SubmitButton from './submitbutton';
import VehicleTable from './vehicletable';

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
    darta_miti: ''
  });

  const [ownerInfo, setOwnerInfo] = useState({
    owner_name: '',
    owner_location: ''
  });

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo({
      ...vehicleInfo,
      [name]: value
    });
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerInfo({
      ...ownerInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine vehicle and owner information
    const combinedData = {
      vehicleInfo,
      ownerInfo
    };
    console.log('Form Data Submitted:', combinedData);
    alert('Form submitted successfully!');
    // Add your API call or database logic here
  };

  return (
    <>
    {/* <div className="form-container">
      <h2>Vehicle and Owner Information Form</h2>
      <form onSubmit={handleSubmit}>
        <VehicleForm vehicleInfo={vehicleInfo} handleVehicleChange={handleVehicleChange} />
        <OwnerForm ownerInfo={ownerInfo} handleOwnerChange={handleOwnerChange} />
        <SubmitButton />
      </form>
    </div> */}
    <VehicleTable />
    </>
  );
}

export default VehicleOwnerForm;
