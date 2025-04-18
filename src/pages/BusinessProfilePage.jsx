import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./BusinessProfilePage.css";
import { generateClient } from "aws-amplify/api";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

// Google Map Component
const Map = ({ address, zoom }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
      });

      if (address) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            newMap.setCenter(location);
            new window.google.maps.Marker({
              position: location,
              map: newMap,
              title: "Business Location",
            });
          } else {
            console.error("Geocoding failed:", status, "for address:", address);
            setMapError(`Failed to load map for address: ${address}`);
          }
        });
      } else {
        setMapError("No address provided");
      }

      setMap(newMap);
    }
  }, [ref, map, address, zoom]);

  if (mapError) {
    return <div className="error-state">{mapError}</div>;
  }

  return <div ref={ref} className="map" />;
};

// Render function for Google Maps Wrapper
const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="loading-state">Loading map...</div>;
    case Status.FAILURE:
      return (
        <div className="error-state">Failed to load map: API key issue</div>
      );
    case Status.SUCCESS:
      return null;
    default:
      return null;
  }
};

function PhotoUploadModal({ onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

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

function BusinessProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = generateClient();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await client.models.Business.get(
        { id },
        {
          selectionSet: [
            "name",
            "phoneNumber",
            "photos",
            "category",
            "streetAddress",
            "aptSuiteOther",
            "city",
            "state",
            "zipcode",
            "country",
            "businessHours.day",
            "businessHours.openTime",
            "businessHours.closeTime",
            "businessHours.isClosed",
            "averageRating",
            "reviews.id",
          ],
        }
      );

      if (response.errors) {
        throw new Error("Error fetching business data: " + response.errors);
      }

      const hours = {
        weekday: "",
        weekend: "",
      };
      if (response.data.businessHours) {
        const weekdayHours = response.data.businessHours.find(
          (h) => h.day.toLowerCase() === "monday"
        );
        const weekendHours = response.data.businessHours.find(
          (h) => h.day.toLowerCase() === "saturday"
        );

        hours.weekday = weekdayHours
          ? weekdayHours.isClosed
            ? "Closed"
            : `${weekdayHours.openTime} - ${weekdayHours.closeTime}`
          : "Not available";

        hours.weekend = weekendHours
          ? weekendHours.isClosed
            ? "Closed"
            : `${weekendHours.openTime} - ${weekendHours.closeTime}`
          : "Not available";
      }

      const photos = response.data.photos || [];
      const displayPhotos = photos.length > 1 ? photos.slice(1) : photos;
      const servicePhotos = photos.length > 1 ? photos.slice(1) : photos;

      const fullAddress = [
        response.data.streetAddress,
        response.data.aptSuiteOther,
        response.data.city,
        response.data.state,
        response.data.zipcode,
        response.data.country,
      ]
        .filter(Boolean)
        .join(", ");

      setBusiness({
        id: response.data.id,
        name: response.data.name,
        phoneNumber: response.data.phoneNumber,
        photos: displayPhotos,
        servicePhotos: servicePhotos,
        categories: [response.data.category],
        address: {
          street: response.data.streetAddress,
          aptSuiteOther: response.data.aptSuiteOther,
          city: response.data.city,
          state: response.data.state,
          zipCode: response.data.zipcode,
          country: response.data.country,
          full: fullAddress,
        },
        hours: hours,
        averageRating: response.data.averageRating || 5,
        reviewCount: response.data.reviews ? response.data.reviews.length : 169,
      });
    } catch (error) {
      console.error("Error fetching business data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, [id]);

  useEffect(() => {
    if (business?.photos?.length > 1) {
      const timer = setInterval(() => {
        setCurrentPhotoIndex(
          (prevIndex) => (prevIndex + 1) % business.photos.length
        );
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [business?.photos]);

  const handleMapClick = () => {
    if (business?.address?.full) {
      window.open(
        `https://www.google.com/maps?q=${encodeURIComponent(
          business.address.full
        )}`,
        "_blank"
      );
    } else {
      alert("Location information not available");
    }
  };

  const handleWriteReview = () => {
    console.log("businessID:", business);
    navigate(`/write-review/${id}`);
  };

  const handleAddPhoto = () => {
    setShowPhotoUpload(true);
  };

  const handlePhotoUpload = async (files) => {
    try {
      const validFileTypes = ["image/jpeg", "image/png", "image/webp"];
      const invalidFiles = files.filter(
        (file) => !validFileTypes.includes(file.type)
      );

      if (invalidFiles.length > 0) {
        throw new Error("Invalid file type. Please upload only images.");
      }

      console.log("Uploading files:", files);
      setShowPhotoUpload(false);
      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert(error.message || "Failed to upload photos. Please try again.");
    }
  };

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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  const handleCall = () => {
    const phoneNumber = business?.phoneNumber;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert("Phone number not available");
    }
  };

  const getPhotoName = (path) => {
    if (!path) return "Service";
    const fileName = path.split("/").pop();
    const nameWithoutExtension = fileName.split(".").slice(0, -1).join(".");
    const nameParts = nameWithoutExtension.split("-");
    const cleanName = nameParts[nameParts.length - 1] || "Service";
    return cleanName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error)
    return (
      <div className="error-state">Error loading business: {error.message}</div>
    );
  if (!business) return <div className="error-state">Business not found</div>;

  const hasMultiplePhotos = business.photos.length > 1;

  return (
    <div className="business-profile">
      <Header />
      <div className="content-wrapper">
        <main className="business-content">
          <h1>{business.name}</h1>

          <div className="photo-gallery-container card">
            <div className="photo-gallery">
              {business.photos.length > 0 && (
                <StorageImage
                  path={business.photos[currentPhotoIndex]}
                  bucket="AWSMBG4-private"
                  alt={`${business.name} photo ${currentPhotoIndex + 1}`}
                  className="gallery-image"
                />
              )}
              {hasMultiplePhotos && (
                <div className="photo-indicators">
                  {business.photos.map((_, index) => (
                    <span
                      key={index}
                      className={`indicator ${
                        index === currentPhotoIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentPhotoIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons-container card">
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

          {showPhotoUpload && (
            <PhotoUploadModal
              onClose={() => setShowPhotoUpload(false)}
              onUpload={handlePhotoUpload}
            />
          )}

          {hasMultiplePhotos && (
            <div className="menu-items-container card">
              <h2>Services</h2>
              <div className="menu-items">
                {business.servicePhotos.map((photo, index) => (
                  <div key={index} className="menu-item">
                    <div className="menu-item-image">
                      <StorageImage
                        path={photo}
                        bucket="AWSMBG4-private"
                        alt={`Service ${index + 1}`}
                      />
                    </div>
                    <p>{getPhotoName(photo)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <section className="location-hours card">
            <h2>Location & Hours</h2>
            <div className="location-hours-container">
              <div className="map-container" onClick={handleMapClick}>
                <Wrapper
                  apiKey={import.meta.env.VITE_PLACES_API_KEY || ""}
                  render={render}
                >
                  {business.address.full ? (
                    <Map address={business.address.full} zoom={15} />
                  ) : (
                    <div className="error-state">
                      Map location not available
                    </div>
                  )}
                </Wrapper>
              </div>
              <div className="business-info">
                <div className="business-rating">
                  {business.averageRating} ({business.reviewCount} reviews)
                </div>
                <div className="business-categories">
                  {business.categories.join(", ")}
                </div>
                <div className="business-address">
                  {business.address.street}
                  {business.address.aptSuiteOther && (
                    <>
                      <br />
                      {business.address.aptSuiteOther}
                    </>
                  )}
                  <br />
                  {business.address.city}, {business.address.state}{" "}
                  {business.address.zipCode}
                  <br />
                  {business.address.country}
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
