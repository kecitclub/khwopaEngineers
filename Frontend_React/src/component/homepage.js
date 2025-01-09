import React from "react";
import MyImage from "../images/bg.jpg";
import "./Homepage.css";

const HomePage = () => {
  return (
    <div className="images">
      <nav className="menu-bar">
        <ul>
          <li><a href="#home">Vehicle</a></li>
          <li><a href="#about">Camera</a></li>
        </ul>
      </nav>
      <img src={MyImage} alt="Description" />
    </div>
  );
};

export default HomePage;
