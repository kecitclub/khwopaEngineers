import React from "react";
import MyImage from "../images/bg.jpg";
import "./Homepage.css";

const HomePage = () => {
  return (
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
    </div>
  );
};

export default HomePage;
