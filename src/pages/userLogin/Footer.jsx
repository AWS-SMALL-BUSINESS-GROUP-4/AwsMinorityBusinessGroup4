import React from 'react';
import { FaFacebook, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';



function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="logo">
          <span className="explore">Explore</span>
          <span className="local">Local</span>
        </div>
        <nav>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
        <div className="social-icons">
          <FaFacebook />
          <FaTwitter />
        </div>
      </div>
      <p className="copyright">© ExploreLocal 2025 All Reserved.</p>
    </footer>
  );
}

export default Footer;