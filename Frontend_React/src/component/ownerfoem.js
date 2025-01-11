import React from 'react';

const OwnerForm = ({ ownerInfo, handleOwnerChange }) => {
  return (
    <div>
      <h3>Owner Information</h3>
      <div>
        <label>Owner Name:</label>
        <input 
          type="text" 
          name="owner_name" 
          value={ownerInfo.owner_name || ""} 
          onChange={handleOwnerChange} 
          placeholder="Enter Owner Name"
        />
      </div>
      <div>
        <label>Owner Location:</label>
        <input 
          type="text" 
          name="owner_location" 
          value={ownerInfo.owner_location || ""} 
          onChange={handleOwnerChange} 
          placeholder="Enter Owner Location"
        />
      </div>
    </div>
  );
};

export default OwnerForm;
