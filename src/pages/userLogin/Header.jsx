import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Header() {
  return (
    <header>
      <div className="logo">
        <FaMapMarkerAlt/>
        <span className="explore">Explore</span>
        <span className="local">Local</span>
      </div>
      <nav>
        <a href="#">Home</a>
        <a href="#">Support</a>
        <a href="#">Business Login</a>
      </nav>
    </header>
  );
}

export default Header;