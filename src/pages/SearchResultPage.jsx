import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { generateClient } from "aws-amplify/data";
import "./SearchResultPage.css";

// Helper function to format phone numbers
const formatPhoneNumber = (phone) => {
  if (!phone || phone.length !== 10) return phone; // Return as-is if not 10 digits
  const areaCode = phone.slice(0, 3);
  const prefix = phone.slice(3, 6);
  const lineNumber = phone.slice(6, 10);
  return `(${areaCode}) ${prefix}-${lineNumber}`;
};

// Helper function to normalize words for plural/singular handling
// This ensures that "restaurants" matches "restaurant", "categories" matches "category", etc.
const normalizeWord = (word) => {
  if (!word) return "";
  let normalized = word.toLowerCase();
  // Remove common plural endings for comparison
  if (normalized.endsWith("ies")) {
    return normalized.slice(0, -3) + "y"; // e.g., "categories" -> "category"
  } else if (normalized.endsWith("es")) {
    return normalized.slice(0, -2); // e.g., "buses" -> "bus"
  } else if (normalized.endsWith("s")) {
    return normalized.slice(0, -1); // e.g., "restaurants" -> "restaurant"
  }
  return normalized;
};

// Helper function to calculate relevance score for a business
// Scores are based on how well the search query matches the business name and category
const calculateRelevanceScore = (business, searchWords) => {
  let score = 0;
  const nameWords = business.name.toLowerCase().split(/\s+/);
  const categoryWords = business.category
    ? business.category.toLowerCase().split(/\s+/)
    : [];
  const normalizedNameWords = nameWords.map(normalizeWord);
  const normalizedCategoryWords = categoryWords.map(normalizeWord);

  searchWords.forEach((searchWord) => {
    const normalizedSearchWord = normalizeWord(searchWord);
    // Check for matches in name
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
    // Check for matches in category
    categoryWords.forEach((word, index) => {
      const normalizedWord = normalizedCategoryWords[index];
      if (normalizedWord === normalizedSearchWord) {
        score += 8; // Exact match in category (slightly less weight than name)
      } else if (normalizedWord.includes(normalizedSearchWord)) {
        score += 4; // Partial match in category
      } else if (word.includes(searchWord)) {
        score += 2; // Partial match in original category word
      }
    });
  });

  return score;
};

// Helper function to calculate relevance score for autocomplete suggestions
// This focuses on matching the business name only, used for the autocomplete dropdown
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
// This prevents excessive API calls while the user is typing
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// BusinessList Component
// Fetches businesses from the backend, scores them based on the search query,
// and renders the filtered and sorted results
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
        // Fetch a broader set of businesses, apply minimal filtering server-side
        const response = await client.models.Business.list({
          filter: categoryFilter
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
            "category",
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

        const allBusinesses = response.data.map((business) => ({
          id: business.id,
          name: business.name,
          phone: business.phoneNumber,
          description: business.description,
          address: business.streetAddress,
          city: business.city,
          state: business.state,
          zip: business.zipcode,
          image: business.photos?.[0] || null,
          category: business.category || "",
        }));

        // If there's no search query, display all businesses (filtered by category if applicable)
        if (!searchQuery) {
          setBusinesses(allBusinesses);
          setLoading(false);
          return;
        }

        // Split search query into words and normalize
        const searchWords = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 0);

        // Calculate relevance scores for each business
        const scoredBusinesses = allBusinesses.map((business) => ({
          business,
          score: calculateRelevanceScore(business, searchWords),
        }));

        // Filter out businesses with a score of 0 and sort by score (descending)
        const filteredBusinesses = scoredBusinesses
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .map(({ business }) => business);

        console.log("Filtered and sorted businesses:", filteredBusinesses);
        setBusinesses(filteredBusinesses);
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
              <p className="business-phone">
                {formatPhoneNumber(business.phone)}
              </p>
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
// Handles the search input, provides autocomplete suggestions,
// and triggers the search as the user types
function SearchBar({ initialQuery = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [businessNames, setBusinessNames] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
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
        ]; // Remove duplicates
        setBusinessNames(names);
      } catch (err) {
        console.error("Error fetching business names:", err);
      }
    };

    fetchBusinessNames();
  }, [client]);

  // Update search term when initialQuery changes
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  // Debounced function to navigate with the search term
  const debouncedNavigate = useRef(
    debounce((term) => {
      const params = new URLSearchParams(location.search);
      if (term.trim()) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      navigate(`/search?${params.toString()}`);
    }, 300)
  ).current;

  // Handle input change for search and suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Trigger search as the user types
    debouncedNavigate(value);

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
    const params = new URLSearchParams(location.search);
    params.set("q", suggestion);
    navigate(`/search?${params.toString()}`);
  };

  // Handle back button click to clear search and navigate to home
  const handleBackClick = () => {
    setSearchTerm("");
    setSuggestions([]);
    navigate("/");
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

  return (
    <div className="search-bar" ref={searchInputRef}>
      <button
        className="back-button"
        onClick={handleBackClick}
        aria-label="Go back to home page"
      >
        <FaArrowLeft />
      </button>
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search"
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
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" aria-label="Submit search">
          <FaSearch />
        </button>
      </form>
    </div>
  );
}

// Sidebar Component
// Provides navigation links for filtering views (Business Information, Reviews, Photos)
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
// Main component that orchestrates the search page layout
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
