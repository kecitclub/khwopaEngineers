import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./UpdateCamera.css";

const UpdateCamera = () => {
  const { id } = useParams(); // Extract the camera ID from the URL
  const [camip, setCamip] = useState("");
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [angleReferenceToNorth, setAngleReferenceToNorth] = useState("");
  const [stationId, setStationId] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [installedDate, setInstalledDate] = useState("");
  const [lastMaintenance, setLastMaintenance] = useState("");
  const [resolution, setResolution] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch camera data when component mounts or id changes
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/camera/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Camera not found");
          }
          return response.json();
        })
        .then((result) => {
          const data = result.data;
          setCamip(data.camip || "");
          setName(data.name || "");
          setLatitude(data.latitude || "");
          setLongitude(data.longitude || "");
          setAngleReferenceToNorth(data.angle_reference_to_north || "");
          setStationId(data.station_id || "");
          setStatus(data.status || "");
          setType(data.type || "");
          setInstalledDate(data.installed_date || "");
          setLastMaintenance(data.last_maintenance || "");
          setResolution(data.resolution || "");
          setMessage("");
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to fetch camera data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdate = async () => {
    // Validate required fields
    if (
      !camip ||
      !name ||
      !latitude ||
      !longitude ||
      !angleReferenceToNorth ||
      !stationId ||
      !status ||
      !type ||
      !installedDate ||
      !lastMaintenance ||
      !resolution
    ) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setMessage("Updating camera...");

    try {
      const response = await fetch(`http://localhost:5000/camera/update-camera/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          camip,
          name,
          latitude,
          longitude,
          angle_reference_to_north: angleReferenceToNorth,
          station_id: stationId,
          status,
          type,
          installed_date: installedDate,
          last_maintenance: lastMaintenance,
          resolution,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "Camera updated successfully");
      } else {
        setMessage(result.message || "Failed to update camera.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-camera-container">
      <h2>Update Camera</h2>
      {loading ? (
        <p className="loading-message">Loading camera data...</p>
      ) : (
        <form className="update-camera-form">
          <input
            type="text"
            placeholder="Camera IP"
            value={camip}
            onChange={(e) => setCamip(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          <input
            type="text"
            placeholder="Angle Reference to North"
            value={angleReferenceToNorth}
            onChange={(e) => setAngleReferenceToNorth(e.target.value)}
          />
          <input
            type="text"
            placeholder="Station ID"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="date"
            placeholder="Installed Date"
            value={installedDate}
            onChange={(e) => setInstalledDate(e.target.value)}
          />
          <input
            type="date"
            placeholder="Last Maintenance"
            value={lastMaintenance}
            onChange={(e) => setLastMaintenance(e.target.value)}
          />
          <input
            type="text"
            placeholder="Resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          />
          <button type="button" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Camera"}
          </button>
        </form>
      )}
      <p
        className={`message ${
          message.includes("Failed") || message.includes("error") ? "error" : "success"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default UpdateCamera;
