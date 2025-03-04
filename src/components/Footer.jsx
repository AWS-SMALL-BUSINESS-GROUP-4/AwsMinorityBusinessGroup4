import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>©API Alchemists 2024-2025</p>
      </div>
    </footer>
  );
}

export default Footer;
