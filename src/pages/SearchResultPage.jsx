import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { generateClient } from "aws-amplify/data";
import "./SearchResultPage.css";

// BusinessList Component
function BusinessList({ searchQuery, categoryFilter }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const client = generateClient();

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        console.log(
          "Fetching businesses with query:",
          searchQuery,
          "and category:",
          categoryFilter
        );
        const response = await client.models.Business.list({
          filter: searchQuery
            ? {
                or: [
                  { name: { contains: searchQuery } },
                  { category: { contains: searchQuery } },
                ],
              }
            : categoryFilter
            ? { category: { eq: categoryFilter } }
            : undefined,
          selectionSet: [
            "id",
            "name",
            "phoneNumber",
            "description",
            "streetAddress",
            "city",
            "state",
            "zipcode",
            "photos",
          ],
        });

        console.log("API Response:", response);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response data from API");
        }

        if (response.errors) {
          throw new Error(
            `Failed to fetch businesses: ${response.errors.message}`
          );
        }

        const fetchedBusinesses = response.data.map((business) => ({
          id: business.id,
          name: business.name,
          phone: business.phoneNumber,
          description: business.description,
          address: business.streetAddress,
          city: business.city,
          state: business.state,
          zip: business.zipcode,
          image: business.photos?.[0] || null, // Use first photo or null
        }));

        console.log("Fetched businesses:", fetchedBusinesses);
        setBusinesses(fetchedBusinesses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching businesses:", err);
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
              {business.image ? (
                <StorageImage
                  alt={business.name}
                  path={business.image}
                  bucket="AWSMBG4-private"
                  className="business-image-content"
                  fallbackSrc="https://amplify-awsminoritybusine-awsmbg4privatebucket9942-u4kp8slu2wjh.s3.us-east-1.amazonaws.com/business-photos/1744853422099-rahama.jpeg"
                />
              ) : (
                <img
                  src="https://amplify-awsminoritybusine-awsmbg4privatebucket9942-u4kp8slu2wjh.s3.us-east-1.amazonaws.com/business-photos/1744853422099-rahama.jpeg"
                  alt={business.name}
                  className="business-image-content business-image-fallback"
                />
              )}
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

// SearchBar Component
function SearchBar({ initialQuery = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
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

// Sidebar Component
function Sidebar({ currentFilters = {}, onFilterChange = () => {} }) {
  const handleFilterClick = (filterType) => {
    console.log(`Filter clicked: ${filterType}`);
    onFilterChange({ view: filterType });
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
    </div>
  );
}

// SearchResultPage Component
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
