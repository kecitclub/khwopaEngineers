import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    // Vehicle fields
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
    darta_miti: '',
    // Owner fields
    owner_name: '',
    owner_location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/create-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message);

      // Clear form after successful submission
      setFormData({
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
        darta_miti: '',
        owner_name: '',
        owner_location: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting the form!');
    }
  };

  return (
    <div className="App">
      <h1>Create Vehicle and Owner</h1>
      <form onSubmit={handleSubmit}>
        {/* Vehicle Form Fields */}
        <h3>Vehicle Information</h3>
        <input
          type="text"
          name="chasis_number"
          value={formData.chasis_number}
          onChange={handleChange}
          placeholder="Chasis Number"
          required
        />
        <input
          type="text"
          name="engine_number"
          value={formData.engine_number}
          onChange={handleChange}
          placeholder="Engine Number"
          required
        />
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="model_number"
          value={formData.model_number}
          onChange={handleChange}
          placeholder="Model Number"
          required
        />
        <input
          type="number"
          name="build_year"
          value={formData.build_year}
          onChange={handleChange}
          placeholder="Build Year"
        />
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Color"
        />
        <input
          type="number"
          name="cylinder_no"
          value={formData.cylinder_no}
          onChange={handleChange}
          placeholder="Cylinder No"
        />
        <input
          type="number"
          name="horse_power"
          value={formData.horse_power}
          onChange={handleChange}
          placeholder="Horse Power"
        />
        <input
          type="number"
          name="seat_capacity"
          value={formData.seat_capacity}
          onChange={handleChange}
          placeholder="Seat Capacity"
        />
        <input
          type="text"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
          placeholder="Fuel Type"
        />
        <select
          name="use_type"
          value={formData.use_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Use Type</option>
          <option value="personal">Personal</option>
          <option value="public">Public</option>
        </select>
        <input
          type="text"
          name="number_plate"
          value={formData.number_plate}
          onChange={handleChange}
          placeholder="Number Plate"
          required
        />
        <input
          type="date"
          name="darta_miti"
          value={formData.darta_miti}
          onChange={handleChange}
        />

        {/* Owner Form Fields */}
        <h3>Owner Information</h3>
        <input
          type="text"
          name="owner_name"
          value={formData.owner_name}
          onChange={handleChange}
          placeholder="Owner Name"
          required
        />
        <input
          type="text"
          name="owner_location"
          value={formData.owner_location}
          onChange={handleChange}
          placeholder="Owner Location"
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
