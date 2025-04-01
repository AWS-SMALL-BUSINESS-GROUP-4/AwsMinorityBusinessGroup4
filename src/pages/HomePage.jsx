// src/pages/HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUtensils,
  FaHome,
  FaCar,
  FaShoppingBag,
  FaCut,
  FaGlassMartini,
  FaEllipsisH,
  FaTshirt,
  FaWrench,
  FaDumbbell,
  FaSpa,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <HeroSearch />
        <CategoryNav />
      </main>
      <Footer />
    </div>
  );
}

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

function CategoryNav() {
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainCategories = [
    { id: "restaurants", icon: <FaUtensils />, name: "Restaurants" },
    { id: "home_services", icon: <FaHome />, name: "Home Services" },
    { id: "auto_services", icon: <FaCar />, name: "Auto Services" },
    { id: "shopping", icon: <FaShoppingBag />, name: "Shopping" },
    { id: "beauty", icon: <FaCut />, name: "Beauty & Spa" },
    { id: "nightlife", icon: <FaGlassMartini />, name: "Nightlife" },
    { id: "more", icon: <FaEllipsisH />, name: "More" },
  ];

  const moreCategories = [
    { id: "dry_cleaning", icon: <FaTshirt />, name: "Dry Cleaning" },
    { id: "repair", icon: <FaWrench />, name: "Phone Repair" },
    { id: "fitness", icon: <FaDumbbell />, name: "Gyms" },
    { id: "massage", icon: <FaSpa />, name: "Massage" },
    // Add more categories as needed
  ];

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "more") {
      setShowMoreMenu(!showMoreMenu);
    } else {
      navigate(`/search?category=${categoryId}`);
      setShowMoreMenu(false);
    }
  };

  return (
    <section className="category-nav">
      <div className="category-container">
        {mainCategories.map((category) => (
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

      {showMoreMenu && (
        <div className="more-categories-dropdown">
          {moreCategories.map((category) => (
            <div
              key={category.id}
              className="more-category-item"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="more-category-icon">{category.icon}</div>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
