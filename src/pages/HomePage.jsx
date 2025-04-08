// src/pages/HomePage.jsx
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
  FaStar,
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
        <FeaturedLocalFavorites />
        <AddYourBusiness />
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
        <h1>Discover the Best Local Spots Near You!</h1>
        <form onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Find restaurants, shops, and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search businesses"
            />
            <button type="submit" aria-label="Submit search">
              Search
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

function FeaturedLocalFavorites() {
  const favorites = [
    {
      type: "Restaurant",
      name: "Cozy Italian Eatery",
      description: "Cozy Italian eatery with the best pasta in town.",
      image: "/images/pizza.jpg",
      rating: 5,
    },
    {
      type: "Fast aurant",
      name: "Great Steak",
      description: "Great steak and seasonal sides.",
      image: "/images/steak.jpeg",
      rating: 5,
    },
    {
      type: "Spa",
      name: "Spa Name",
      description: "Relaxing massages and facial treatments.",
      image: "/images/spa.jpg",
      rating: 5,
    },
  ];

  return (
    <section className="featured-local-favorites">
      <h2>Featured Local Favorites</h2>
      <div className="favorites-container">
        {favorites.map((favorite, index) => (
          <div key={index} className="favorite-item">
            <img src={favorite.image} alt={favorite.name} />
            <div className="favorite-details">
              <span className="favorite-type">{favorite.type}</span>
              <div className="favorite-rating">
                {[...Array(favorite.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p>{favorite.description}</p>
              <button className="view-more-btn">View More</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AddYourBusiness() {
  return (
    <section className="add-your-business">
      <h2>Own a Business? Get Listed Today!</h2>
      <p>Reach more customers and grow your business with us.</p>
      <button className="add-business-btn">Add Your Business</button>
    </section>
  );
}

export default HomePage;