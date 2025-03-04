import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">Logo</Link>
        </div>
        <div className="nav-container">
          <nav className="main-nav">
            <Link to="/my-businesses">My Businesses</Link>
            <Link to="/write-review">Write a Review</Link>
          </nav>
          <div className="auth-nav">
            <Link to="/login" className="login-button">
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// In Header.jsx
function Header() {
  console.log("Header rendered");
  // ... rest of header code
}
export default Header;
