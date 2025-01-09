import React from 'react';

const CameraForm = ({ cameraInfo, handleCameraChange }) => {
  return (
    <div>

      {/* Camera IP Field at the top */}
      <div className="form-row" id='camera'>
        <div>
          <label>Camera IP:</label>
          <input
            type="text"
            name="camip"
            value={cameraInfo.camip}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Latitude and Longitude in the same row */}
      <div className="form-row">
        <div style={{ flex: 1, paddingRight: '10px' }}>
          <label>Latitude:</label>
          <input
            type="number"
            name="latitude"
            value={cameraInfo.latitude}
            onChange={handleCameraChange}
            required
            step="0.000001"  // To capture up to 6 decimal places
          />
        </div>

        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <label>Longitude:</label>
          <input
            type="number"
            name="longitude"
            value={cameraInfo.longitude}
            onChange={handleCameraChange}
            required
            step="0.000001"  // To capture up to 6 decimal places
          />
        </div>
      </div>

      {/* Angle reference to North and Station ID in the same row */}
      <div className="form-row">
        <div style={{ flex: 1, paddingRight: '10px' }}>
          <label>Angle Reference to North:</label>
          <input
            type="number"
            name="angle_reference_to_north"
            value={cameraInfo.angle_reference_to_north}
            onChange={handleCameraChange}
            required
            step="0.1"
          />
        </div>

        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <label>Station ID:</label>
          <input
            type="number"
            name="station_id"
            value={cameraInfo.station_id}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

    </div>
  );
};

export default CameraForm;
