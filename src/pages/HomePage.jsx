import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUtensils,
  FaMugHot,
  FaCut,
  FaGlassMartiniAlt,
  FaTruck,
  FaShoppingBag,
  FaCalendarAlt,
  FaEllipsisH,
} from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
      <main>
        {/* Hero Search Section */}
        <HeroSearch />
        {/* Category Navigation Section */}
        <CategoryNav />
      </main>
      <Footer />
    </div>
  );
}

// =============================================
// Hero Search Component
// =============================================
function HeroSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <section className="hero-search">
      <div className="search-container">
        <h2>Looking for a place?</h2>
        <form onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search businesses"
            />
            <button type="submit" aria-label="Submit search">
              <FaSearch />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// =============================================
// Category Navigation Component
// =============================================
function CategoryNav() {
  const navigate = useNavigate();

  // Category definitions
  const categories = [
    { id: "restaurants", icon: <FaUtensils />, name: "Restaurants" },
    { id: "coffee", icon: <FaMugHot />, name: "Coffee & Tea" },
    { id: "hairdressers", icon: <FaCut />, name: "Hairdressers" },
    { id: "bars", icon: <FaGlassMartiniAlt />, name: "Bars" },
    { id: "delivery", icon: <FaTruck />, name: "Delivery" },
    { id: "takeout", icon: <FaShoppingBag />, name: "Takeout" },
    { id: "reservations", icon: <FaCalendarAlt />, name: "Reservations" },
    { id: "more", icon: <FaEllipsisH />, name: "More" },
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <section className="category-nav">
      <div className="category-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
