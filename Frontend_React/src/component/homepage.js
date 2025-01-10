import React from "react";
import Navbar from "./navbar";  // Import Navbar component
import { Link } from "react-router-dom";
import "./navbar.css";

const HomePage = () => {
  return (
<<<<<<< HEAD
    <div className="images">
      <nav className="menu-bar">
        <ul>
          <li>
            <a href="/vehicle">Vehicle</a>
            <ul className="dropdown-menu">
              <li>
                <a href="#create">Create a</a>

              </li>
            </ul>
          </li>
          <li>
            <a href="/camera">Camera</a>
            <ul className="dropdown-menu">
              <li>
                <a href="#create">Create</a>
                <a href="#create">Update</a>
                <a href="#create">Delete</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <img src={MyImage} alt="Background" id="imagefield" />
=======
    <div>
      {/* Navbar component included here */}
      <Navbar />

      <div className="main-content">
        <div className="info">
          <h2>Welcome to the Vehicle Management System</h2>
          <p>
            Manage all your vehicles, drivers, and cameras with ease. Our
            comprehensive system allows you to create, insert, and delete vehicle
            entries, as well as manage camera feeds for security and monitoring.
          </p>
          <p>
            Whether you're managing a fleet of vehicles or setting up a security
            system, our platform provides a seamless interface and powerful
            features.
          </p>
        </div>
        <div className="cta">
          <h3>Get Started with Vehicle Management</h3>
          <p>
            Select an option from the menu to begin managing your vehicles and
            camera systems.
          </p>
        </div>
      </div>
>>>>>>> 680df69e3885f0b971b184e4996299de7ecbfe8c
    </div>
  );
};

export default HomePage;
