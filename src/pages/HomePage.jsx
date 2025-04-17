import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { generateClient } from "aws-amplify/data";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

// Helper function to normalize words for plural/singular handling
const normalizeWord = (word) => {
  if (!word) return "";
  let normalized = word.toLowerCase();
  if (normalized.endsWith("ies")) {
    return normalized.slice(0, -3) + "y"; // e.g., "categories" -> "category"
  } else if (normalized.endsWith("es")) {
    return normalized.slice(0, -2); // e.g., "buses" -> "bus"
  } else if (normalized.endsWith("s")) {
    return normalized.slice(0, -1); // e.g., "restaurants" -> "restaurant"
  }
  return normalized;
};

// Helper function to calculate relevance score for autocomplete suggestions
const calculateAutocompleteScore = (name, searchWords) => {
  let score = 0;
  const nameWords = name.toLowerCase().split(/\s+/);
  const normalizedNameWords = nameWords.map(normalizeWord);

  searchWords.forEach((searchWord) => {
    const normalizedSearchWord = normalizeWord(searchWord);
    nameWords.forEach((word, index) => {
      const normalizedWord = normalizedNameWords[index];
      if (normalizedWord === normalizedSearchWord) {
        score += 10; // Exact match after normalization
      } else if (normalizedWord.includes(normalizedSearchWord)) {
        score += 5; // Partial match after normalization
      } else if (word.includes(searchWord)) {
        score += 3; // Partial match in original word
      }
    });
  });

  return score;
};

// Debounce function to limit how often the search is triggered
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

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
  const [suggestions, setSuggestions] = useState([]);
  const [businessNames, setBusinessNames] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const client = generateClient();
  const searchInputRef = useRef(null);

  // Fetch all business names for autocomplete suggestions
  useEffect(() => {
    const fetchBusinessNames = async () => {
      try {
        const response = await client.models.Business.list({
          selectionSet: ["name"],
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response data from API");
        }

        if (response.errors) {
          throw new Error(
            `Failed to fetch business names: ${response.errors.message}`
          );
        }

        const names = [
          ...new Set(response.data.map((business) => business.name)),
        ];
        setBusinessNames(names);
      } catch (err) {
        console.error("Error fetching business names:", err);
      }
    };

    fetchBusinessNames();
  }, [client]);

  // Handle input change for suggestions only (no navigation)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on input
    if (value.trim()) {
      const searchWords = value
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const scoredSuggestions = businessNames
        .map((name) => ({
          name,
          score: calculateAutocompleteScore(name, searchWords),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ name }) => name)
        .slice(0, 5); // Limit to top 5 suggestions
      setSuggestions(scoredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click to populate the search input and trigger search
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setIsFocused(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle click outside to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <div className="search-input-group" ref={searchInputRef}>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Find restaurants, shops, and more..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                aria-label="Search businesses"
              />
              {suggestions.length > 0 && isFocused && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-icon">
                        <FaSearch />
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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

  const handleCategoryClick = (categoryId, categoryName) => {
    if (categoryId === "more") {
      setShowMoreMenu(!showMoreMenu);
    } else {
      navigate(`/search?q=${encodeURIComponent(categoryName)}`);
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
            onClick={() => handleCategoryClick(category.id, category.name)}
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
              onClick={() => handleCategoryClick(category.id, category.name)}
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
      <Link to="/add-business">
        <button className="add-business-btn">Add Your Business</button>
      </Link>
    </section>
  );
}

export default HomePage;
