// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <FaMapMarkerAlt className="logo-icon" />
            <span className="logo-explore">Explore</span>
            <span className="logo-local">Local</span>
          </Link>
        </div>
        <div className="nav-container">
          <nav className="main-nav">
            <div className="nav-items">
              <div
                className="dropdown-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="dropdown-trigger">My Business</span>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/add-business" className="dropdown-item">
                      Add a Business
                    </Link>
                    <Link to="/business-login" className="dropdown-item">
                      Log into Business
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/write-review" className="nav-link">
                Write a Review
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;