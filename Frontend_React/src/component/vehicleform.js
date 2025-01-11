import React from 'react';

const VehicleForm = ({ vehicleInfo, handleVehicleChange }) => {
  return (
    <div>
      <h3>Vehicle Information</h3>
      <div>
        <label>Chassis Number:</label>
        <input 
          type="text" 
          name="chasis_number" 
          value={vehicleInfo.chasis_number || ""} 
          onChange={handleVehicleChange} 
          required 
          placeholder="Enter Chassis Number"
        />
      </div>
      <div>
        <label>Engine Number:</label>
        <input 
          type="text" 
          name="engine_number" 
          value={vehicleInfo.engine_number || ""} 
          onChange={handleVehicleChange} 
          required 
          placeholder="Enter Engine Number"
        />
      </div>
      <div>
        <label>Company Name:</label>
        <input 
          type="text" 
          name="company_name" 
          value={vehicleInfo.company_name || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Company Name"
        />
      </div>
      <div>
        <label>Model Number:</label>
        <input 
          type="text" 
          name="model_number" 
          value={vehicleInfo.model_number || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Model Number"
        />
      </div>
      <div>
        <label>Build Year:</label>
        <input 
          type="number" 
          name="build_year" 
          value={vehicleInfo.build_year || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Build Year"
        />
      </div>
      <div>
        <label>Color:</label>
        <input 
          type="text" 
          name="color" 
          value={vehicleInfo.color} 
          onChange={handleVehicleChange || ""} 
          placeholder="Enter Color"
        />
      </div>
      <div>
        <label>Cylinder No:</label>
        <input 
          type="number" 
          name="cylinder_no" 
          value={vehicleInfo.cylinder_no} 
          onChange={handleVehicleChange || ""} 
          placeholder="Enter Cylinder No"
        />
      </div>
      <div>
        <label>Horse Power:</label>
        <input 
          type="number" 
          step="0.1" 
          name="horse_power" 
          value={vehicleInfo.horse_power || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Horse Power"
        />
      </div>
      <div>
        <label>Seat Capacity:</label>
        <input 
          type="number" 
          name="seat_capacity" 
          value={vehicleInfo.seat_capacity || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Seat Capacity"
        />
      </div>
      <div>
        <label>Fuel Type:</label>
        <input 
          type="text" 
          name="fuel_type" 
          value={vehicleInfo.fuel_type || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Fuel Type"
        />
      </div>
      <div>
        <label>Use Type:</label>
        <select 
          name="use_type" 
          value={vehicleInfo.use_type || ""} 
          onChange={handleVehicleChange} 
          required
        >
          <option value="">Select</option>
          <option value="personal">Personal</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div>
        <label>Number Plate:</label>
        <input 
          type="text" 
          name="number_plate" 
          value={vehicleInfo.number_plate || ""} 
          onChange={handleVehicleChange} 
          required 
          placeholder="Enter Number Plate"
        />
      </div>
      <div>
        <label>Darta Miti (Date):</label>
        <input 
          type="date" 
          name="darta_miti" 
          value={vehicleInfo.darta_miti || ""} 
          onChange={handleVehicleChange} 
        />
      </div>

      <div>
        <label>Owner Name:</label>
        <input 
          type="text" 
          name="owner_name" 
          value={vehicleInfo.owner_name || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Owner Name"
        />
      </div>
      <div>
        <label>Owner Location:</label>
        <input 
          type="text" 
          name="owner_location" 
          value={vehicleInfo.owner_location || ""} 
          onChange={handleVehicleChange} 
          placeholder="Enter Owner Location"
        />
      </div>
    </div>
  );
};

export default VehicleForm;
