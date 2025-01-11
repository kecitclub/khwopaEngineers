import React from 'react';

const CameraForm = ({ cameraInfo, handleCameraChange }) => {
  return (
    <div>
      {/* Camera IP Field */}
      <div className="form-row">
        <div>
          <label>Camera IP:</label>
          <input
            type="text"
            name="camip"
            value={cameraInfo.camip || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Camera Name/Location */}
      <div className="form-row">
        <div>
          <label>Camera Name/Location:</label>
          <input
            type="text"
            name="name"
            value={cameraInfo.name || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Latitude and Longitude */}
      <div className="form-row">
        <div style={{ flex: 1, paddingRight: '10px' }}>
          <label>Latitude:</label>
          <input
            type="number"
            name="latitude"
            value={cameraInfo.latitude || ""}
            onChange={handleCameraChange}
            required
            step="0.000001"
          />
        </div>

        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <label>Longitude:</label>
          <input
            type="number"
            name="longitude"
            value={cameraInfo.longitude || ""}
            onChange={handleCameraChange}
            required
            step="0.000001"
          />
        </div>
      </div>

      {/* Angle Reference to North and Station ID */}
      <div className="form-row">
        <div style={{ flex: 1, paddingRight: '10px' }}>
          <label>Angle Reference to North:</label>
          <input
            type="number"
            name="angle_reference_to_north"
            value={cameraInfo.angle_reference_to_north || ""}
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
            value={cameraInfo.station_id || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Status */}
      <div className="form-row">
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={cameraInfo.status || ""}
            onChange={handleCameraChange}
            required
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Type */}
      <div className="form-row">
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={cameraInfo.type || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Installed Date */}
      <div className="form-row">
        <div>
          <label>Installed Date:</label>
          <input
            type="date"
            name="installed_date"
            value={cameraInfo.installed_date || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Last Maintenance Date */}
      <div className="form-row">
        <div>
          <label>Last Maintenance:</label>
          <input
            type="date"
            name="last_maintenance"
            value={cameraInfo.last_maintenance || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>

      {/* Resolution */}
      <div className="form-row">
        <div>
          <label>Resolution:</label>
          <input
            type="text"
            name="resolution"
            value={cameraInfo.resolution || ""}
            onChange={handleCameraChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CameraForm;
