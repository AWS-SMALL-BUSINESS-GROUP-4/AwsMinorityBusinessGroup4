// BusinessProfilePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./BusinessProfilePage.css";

// Mock business data structure - would be replaced with API data in production
const mockBusinessData = {
  phoneNumber: "240-660-6613",
  id: "1",
  name: "Negril Jamaican Eatery",
  rating: 3.6,
  reviewCount: 169,
  categories: ["Caribbean", "Seafood", "Sandwiches"],
  address: {
    street: "2301 Georgia Ave. NW",
    city: "Washington",
    state: "DC",
    zipCode: "20001",
  },
  hours: {
    weekday: "10:30 AM - 7:30 PM",
    weekend: "Closed",
  },
  photos: [
    "/images/negril/food1.jpg",
    "/images/negril/menu.jpg",
    "/images/negril/food2.jpg",
  ],
  menuItems: [
    { name: "Curried Chicken", image: "/images/negril/curry-chicken.webp" },
    { name: "Oxtail", image: "/images/negril/oxtail.webp" },
    { name: "Curried Goat", image: "/images/negril/curry-goat.webp" },
    { name: "Jerk Wings", image: "/images/negril/jerk-wings.webp" },
    { name: "Plantain", image: "/images/negril/plantain.jpg" },
    { name: "Bread", image: "/images/negril/bread.jpg" },
  ],
  location: {
    lat: 38.9175,
    lng: -77.0209,
  },
};

// Photo Upload Modal Component - Handles file upload interface
function PhotoUploadModal({ onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle drag and drop functionality
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle file upload with loading state
  const handleUpload = async () => {
    setUploading(true);
    try {
      await onUpload(files);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload-overlay" onClick={onClose}>
      <div
        className="photo-upload-container"
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3>Upload Photos</h3>
        <div className="drop-zone">
          <p>Drag photos here or click to select</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </div>
        {files.length > 0 && (
          <div>
            <p>{files.length} files selected</p>
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// Main Business Profile Component
function BusinessProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        // Simulate API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBusiness(mockBusinessData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching business data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [id]);

  // Handle map click - Opens Google Maps in new tab
  const handleMapClick = () => {
    if (business?.location) {
      const { lat, lng } = business.location;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else {
      alert("Location information not available");
    }
  };

  // Handle write review button click
  const handleWriteReview = () => {
    navigate(`/review/${business.id}`);
  };

  // Handle photo upload button click
  const handleAddPhoto = () => {
    setShowPhotoUpload(true);
  };

  // Handle photo upload submission
  const handlePhotoUpload = async (files) => {
    try {
      // Validate file types
      const validFileTypes = ["image/jpeg", "image/png", "image/webp"];
      const invalidFiles = files.filter(
        (file) => !validFileTypes.includes(file.type)
      );

      if (invalidFiles.length > 0) {
        throw new Error("Invalid file type. Please upload only images.");
      }

      // Mock upload logic - replace with actual API call
      console.log("Uploading files:", files);
      setShowPhotoUpload(false);
      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert(error.message || "Failed to upload photos. Please try again.");
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (!business) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name}`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Handle copy link fallback
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  // Handle phone call
  const handleCall = () => {
    const phoneNumber = business?.phoneNumber;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert("Phone number not available");
    }
  };

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading business: {error.message}</div>;
  if (!business) return <div>Business not found</div>;

  // Main render
  return (
    <div className="business-profile">
      <Header />
      <div className="content-wrapper">
        <main className="business-content">
          {/* Business Name */}
          <h1>{business.name}</h1>

          {/* Photo Gallery */}
          <div className="photo-gallery-container">
            <div className="photo-gallery">
              {business.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${business.name} photo ${index + 1}`}
                  className={`gallery-image-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-container">
            <div className="action-buttons">
              <button
                className="action-btn write-review"
                onClick={handleWriteReview}
              >
                <span className="icon">⭐</span> Write a review
              </button>
              <button className="action-btn add-photo" onClick={handleAddPhoto}>
                <span className="icon">📷</span> Add Photo
              </button>
              <button className="action-btn share" onClick={handleShare}>
                <span className="icon">📤</span> Share
              </button>
              <button className="action-btn call" onClick={handleCall}>
                <span className="icon">📞</span> Call
              </button>
            </div>
          </div>

          {/* Photo Upload Modal */}
          {showPhotoUpload && (
            <PhotoUploadModal
              onClose={() => setShowPhotoUpload(false)}
              onUpload={handlePhotoUpload}
            />
          )}

          {/* Menu Items */}
          <div className="menu-items-container">
            <div className="menu-items">
              {business.menuItems.map((item, index) => (
                <div key={index} className="menu-item">
                  <div className="menu-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location and Hours Section */}
          <section className="location-hours">
            <h2>Location & Hours</h2>
            <div className="location-hours-container">
              <div className="map" onClick={handleMapClick}>
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${business.location.lat},${business.location.lng}&zoom=15&size=400x400&key=YOUR_API_KEY`}
                  alt="Business location map"
                />
              </div>
              <div className="business-info">
                <div className="business-rating">
                  {business.rating} ({business.reviewCount} reviews)
                </div>
                <div className="business-categories">
                  {business.categories.join(", ")}
                </div>
                <div className="business-address">
                  {business.address.street}
                  <br />
                  {business.address.city}, {business.address.state}{" "}
                  {business.address.zipCode}
                </div>
              </div>
              <div className="hours-section">
                <div className="business-hours">
                  <p>Mon-Fri: {business.hours.weekday}</p>
                  <p>Sat-Sun: {business.hours.weekend}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default BusinessProfilePage;
