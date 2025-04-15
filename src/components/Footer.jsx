// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import the location pin icon
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/" className="footer-logo">
          <FaMapMarkerAlt className="footer-logo-icon" />
          <span className="footer-logo-explore">Explore</span>
          <span className="footer-logo-local">Local</span>
        </Link>
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <p>© API Alchemists 2024-{currentYear}</p>
      </div>
    </footer>
  );
}

export default Footer;