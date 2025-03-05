// src/components/searchResultComponents/BusinessList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./SearchResultPage.css";

// Mock data - this would be replaced with API calls later
const mockBusinesses = [
  {
    id: 1,
    name: "Rahama",
    phone: "(240) 452-0155",
    description: "RAHAMA AFRICAN RESTAURANT",
    address: "11454 Cherry Hill Rd",
    city: "Silver Spring",
    state: "MD",
    zip: "20904",
    image: "/images/rahama.jpeg",
  },
  {
    id: 2,
    name: "Negril",
    phone: "(202) 332-3737",
    description: "The Jamaican Eatery",
    address: "2301 Georgia Ave. NW",
    city: "Washington",
    state: "DC",
    zip: "20001",
    image: "/images/negril.png",
  },
];

// =============================================
// BusinessList Component
// =============================================

function BusinessList({ searchQuery, categoryFilter }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This is where you would fetch data from your backend API
    // For now, we'll just simulate an API call with a timeout
    setLoading(true);

    const fetchBusinesses = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In the future, replace this with actual API call:
        // const response = await fetch(`/api/businesses?search=${searchQuery}&category=${categoryFilter}`);
        // const data = await response.json();

        // For now, just filter the mock data based on search query
        const filteredBusinesses = mockBusinesses.filter(
          (business) =>
            business.name
              .toLowerCase()
              .includes((searchQuery || "").toLowerCase()) ||
            business.description
              .toLowerCase()
              .includes((searchQuery || "").toLowerCase())
        );

        setBusinesses(filteredBusinesses);
        setLoading(false);
      } catch (err) {
        setError("Failed to load businesses. Please try again.");
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [searchQuery, categoryFilter]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (businesses.length === 0) {
    return (
      <div className="no-results">
        No businesses found matching your search.
      </div>
    );
  }

  return (
    <div className="business-list">
      {businesses.map((business) => (
        <div key={business.id} className="business-card">
          <div className="business-info">
            <div className="business-image">
              <img
                src={business.image}
                alt={business.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <div className="business-details">
              <h3 className="business-name">
                <Link to={`/business/${business.id}`}>{business.name}</Link>
              </h3>
              <p className="business-phone">{business.phone}</p>
              <p className="business-description">{business.description}</p>
              <p className="business-address">
                {business.address}, {business.city}, {business.state}{" "}
                {business.zip}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================
// Searchbar Component
// =============================================
function SearchBar({ initialQuery = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Update search term when initialQuery changes
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Preserve any other query parameters
      const params = new URLSearchParams(location.search);
      params.set("q", searchTerm);
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="search-bar">
      <button
        className="back-button"
        onClick={handleBackClick}
        aria-label="Go back to home page"
      >
        <FaArrowLeft />
      </button>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          aria-label="Search businesses"
        />
        <button type="submit" aria-label="Submit search">
          <FaSearch />
        </button>
      </form>
    </div>
  );
}

// =============================================
// Side Component
// =============================================
function Sidebar({ currentFilters = {}, onFilterChange = () => {} }) {
  // This would be expanded with actual filter options
  const handleFilterClick = (filterType) => {
    // For now, just for demonstration purposes
    console.log(`Filter clicked: ${filterType}`);

    // In a real implementation, this would update the filters
    // For example: onFilterChange({ sortBy: 'rating' });
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-navigation">
        <li
          className={`sidebar-item ${
            !currentFilters.view || currentFilters.view === "info"
              ? "active"
              : ""
          }`}
          onClick={() => handleFilterClick("info")}
        >
          Business Information
        </li>
        <li
          className={`sidebar-item ${
            currentFilters.view === "reviews" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("reviews")}
        >
          Reviews
        </li>
        <li
          className={`sidebar-item ${
            currentFilters.view === "photos" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("photos")}
        >
          Photos
        </li>
      </ul>
      {/* Additional filter options would go here */}
    </div>
  );
}

// After all other components, before export
function SearchResultPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";

  const [filters, setFilters] = useState({});

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div className="search-result-page">
      <div className="search-header">
        <Header />
        <SearchBar initialQuery={searchQuery} />
      </div>
      <h1 className="page-title">Search Results</h1>
      <div className="search-content">
        <Sidebar
          currentFilters={{ ...filters, category: categoryFilter }}
          onFilterChange={updateFilters}
        />
        <BusinessList
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          additionalFilters={filters}
        />
      </div>
      <Footer />
    </div>
  );
}
export default SearchResultPage;
