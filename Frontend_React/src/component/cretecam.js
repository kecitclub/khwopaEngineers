import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const CameraTable = () => {
  const [cameraData, setCameraData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:5000/camera")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setCameraData(data.data); // Set the camera data
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.message || "An error occurred while fetching data");
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, []);

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Camera Information</h2>
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
              <th>Camera ID</th>
              <th>Camera IP</th>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Angle to North</th>
              <th>Station ID</th>
              <th>Status</th>
              <th>Type</th>
              <th>Installed Date</th>
              <th>Last Maintenance</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {cameraData.map((camera) => (
              <tr key={camera.camid}>
                <td>{camera.camid}</td>
                <td>{camera.camip}</td>
                <td>{camera.name}</td>
                <td>{camera.latitude}</td>
                <td>{camera.longitude}</td>
                <td>{camera.angle_reference_to_north}</td>
                <td>{camera.station_id}</td>
                <td>{camera.status}</td>
                <td>{camera.type}</td>
                <td>{formatDate(camera.installed_date)}</td>
                <td>{formatDate(camera.last_maintenance)}</td>
                <td>{camera.resolution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CameraTable;
