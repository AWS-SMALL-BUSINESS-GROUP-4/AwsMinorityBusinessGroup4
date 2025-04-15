// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);
  const handleAccountMouseEnter = () => setShowAccountDropdown(true);
  const handleAccountMouseLeave = () => setShowAccountDropdown(false);

  const handleLogout = () => {
    logout();
    setShowAccountDropdown(false);
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
              {isLoggedIn ? (
                <div
                  className="dropdown-container"
                  onMouseEnter={handleAccountMouseEnter}
                  onMouseLeave={handleAccountMouseLeave}
                >
                  <span className="account-trigger">
                    <FaUser className="account-icon" />
                    My Account
                  </span>
                  {showAccountDropdown && (
                    <div className="dropdown-menu">
                      <Link to="/about-me" className="dropdown-item">
                        About Me
                      </Link>
                      <Link to="/my-collections" className="dropdown-item">
                        My Collections
                      </Link>
                      <Link to="/account-settings" className="dropdown-item">
                        Account Settings
                      </Link>
                      <div onClick={handleLogout} className="dropdown-item">
                        Log Out
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="sign-in-button">
                  Sign In/Up
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;