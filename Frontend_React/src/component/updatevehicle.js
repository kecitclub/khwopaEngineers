import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./UpdateVehicle.css";

const UpdateVehicle = () => {
  const { id } = useParams(); // Extract the vehicle ID from the URL
  const [vehicleInfo, setVehicleInfo] = useState({
    chasis_number: "",
    engine_number: "",
    company_name: "",
    model_number: "",
    build_year: "",
    color: "",
    cylinder_no: "",
    horse_power: "",
    seat_capacity: "",
    fuel_type: "",
    use_type: "",
    number_plate: "",
    darta_miti: "",
    owner_name: "",
    owner_location: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch vehicle data when component mounts or id changes
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/vehicle/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Vehicle not found");
          }
          return response.json();
        })
        .then((result) => {
          const data = result.data;
          setVehicleInfo({
            chasis_number: data.chasis_number || "",
            engine_number: data.engine_number || "",
            company_name: data.company_name || "",
            model_number: data.model_number || "",
            build_year: data.build_year || "",
            color: data.color || "",
            cylinder_no: data.cylinder_no || "",
            horse_power: data.horse_power || "",
            seat_capacity: data.seat_capacity || "",
            fuel_type: data.fuel_type || "",
            use_type: data.use_type || "",
            number_plate: data.number_plate || "",
            darta_miti: data.darta_miti || "",
            owner_name: data.owner_name || "",
            owner_location: data.owner_location || "",
          });
          setMessage("");
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to fetch vehicle data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdate = async () => {
    const {
      chasis_number,
      engine_number,
      company_name,
      model_number,
      build_year,
      color,
      cylinder_no,
      horse_power,
      seat_capacity,
      fuel_type,
      use_type,
      number_plate,
      darta_miti,
      owner_name,
      owner_location,
    } = vehicleInfo;

    // Validate required fields
    if (
      !chasis_number ||
      !engine_number ||
      !company_name ||
      !model_number ||
      !build_year ||
      !color ||
      !cylinder_no ||
      !horse_power ||
      !seat_capacity ||
      !fuel_type ||
      !use_type ||
      !number_plate ||
      !darta_miti ||
      !owner_name ||
      !owner_location
    ) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setMessage("Updating vehicle...");

    try {
      const response = await fetch(`http://localhost:5000/vehicle/update-vehicle/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chasis_number,
          engine_number,
          company_name,
          model_number,
          build_year,
          color,
          cylinder_no,
          horse_power,
          seat_capacity,
          fuel_type,
          use_type,
          number_plate,
          darta_miti,
          owner_name,
          owner_location,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "Vehicle updated successfully");
      } else {
        setMessage(result.message || "Failed to update vehicle.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo({
      ...vehicleInfo,
      [name]: value,
    });
  };

  return (
    <div className="update-vehicle-container">
      <h2>Update Vehicle</h2>
      {loading ? (
        <p className="loading-message">Loading vehicle data...</p>
      ) : (
        <form className="update-vehicle-form">
          <input
            type="text"
            name="chasis_number"
            placeholder="Chasis Number"
            value={vehicleInfo.chasis_number}
            onChange={handleChange}
          />
          <input
            type="text"
            name="engine_number"
            placeholder="Engine Number"
            value={vehicleInfo.engine_number}
            onChange={handleChange}
          />
          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={vehicleInfo.company_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="model_number"
            placeholder="Model Number"
            value={vehicleInfo.model_number}
            onChange={handleChange}
          />
          <input
            type="number"
            name="build_year"
            placeholder="Build Year"
            value={vehicleInfo.build_year}
            onChange={handleChange}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={vehicleInfo.color}
            onChange={handleChange}
          />
          <input
            type="number"
            name="cylinder_no"
            placeholder="Cylinder Number"
            value={vehicleInfo.cylinder_no}
            onChange={handleChange}
          />
          <input
            type="number"
            name="horse_power"
            placeholder="Horse Power"
            value={vehicleInfo.horse_power}
            onChange={handleChange}
          />
          <input
            type="number"
            name="seat_capacity"
            placeholder="Seat Capacity"
            value={vehicleInfo.seat_capacity}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fuel_type"
            placeholder="Fuel Type"
            value={vehicleInfo.fuel_type}
            onChange={handleChange}
          />
          <select
            name="use_type"
            value={vehicleInfo.use_type}
            onChange={handleChange}
          >
            <option value="">Select Use Type</option>
            <option value="personal">Personal</option>
            <option value="public">Public</option>
          </select>
          <input
            type="text"
            name="number_plate"
            placeholder="Number Plate"
            value={vehicleInfo.number_plate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="darta_miti"
            placeholder="Darta Miti"
            value={vehicleInfo.darta_miti}
            onChange={handleChange}
          />
          <input
            type="text"
            name="owner_name"
            placeholder="Owner Name"
            value={vehicleInfo.owner_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="owner_location"
            placeholder="Owner Location"
            value={vehicleInfo.owner_location}
            onChange={handleChange}
          />
          <button type="button" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Vehicle"}
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

export default UpdateVehicle;
