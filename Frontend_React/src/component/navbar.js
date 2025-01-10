import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className="navcomponent">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {/* Vehicle Menu with Sub-navbar */}
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/vehicle">
                  Vehicle
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/vehicle/create">
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vehicle/insert">
                      Insert
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vehicle/delete">
                      Delete
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Camera Menu with Sub-navbar */}
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/camera">
                  Camera
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/camera/create">
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/camera/insert">
                      Insert
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/camera/delete">
                      Delete
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
