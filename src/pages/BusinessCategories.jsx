import React, { useState } from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BusinessCreationForm.css';

export default function BusinessCategories() {
  const {
    step,
    formData,
    setFormData,
    errors,
    nextStep,
    isSignedIn,
    navigateToStep,
  } = useBusinessForm();

  // Set total steps based on authentication status
  const totalSteps = isSignedIn ? 9 : 10;

  const handleStepClick = (stepNumber) => {
    navigateToStep(stepNumber);
  };

  // Placeholder list of categories
  const categoriesList = [
    'Restaurant', 'Cafe', 'Retail', 'Salon', 'Gym', 'Bakery',
    'Bar', 'Spa', 'Bookstore', 'Pharmacy', 'Florist', 'Pet Store'
  ];

  // State to track selected categories (up to 3)
  const selectedCategories = formData.categories ? formData.categories.split(', ').filter(cat => cat) : [];

  const handleCategoryToggle = (category) => {
    let updatedCategories;
    if (selectedCategories.includes(category)) {
      // Deselect the category
      updatedCategories = selectedCategories.filter(cat => cat !== category);
    } else {
      // Select the category, but limit to 3
      if (selectedCategories.length >= 3) return; // Prevent adding more than 3
      updatedCategories = [...selectedCategories, category];
    }
    // Update formData with the new categories as a comma-separated string
    setFormData((prev) => ({
      ...prev,
      categories: updatedCategories.join(', ')
    }));
  };

  return (
    <div className="form-container">
      <header className="revamped-header">
        <div className="nav-content">
          <div className="header-left">
            <Link to="/" className="logo-link">
              <span className="logo-icon">
                <FaMapMarkerAlt />
              </span>
              <span className="logo-text revamped-logo">
                <span className="logo-explore">Explore</span>
                <span className="logo-local">Local</span>
              </span>
            </Link>
          </div>
          <nav className="header-nav">
            <a href="#">Home</a>
            <a href="#">Support</a>
            <a href="#">Business Login</a>
          </nav>
        </div>
      </header>

      <div className="revamped-hero-section">
        <div className="revamped-hero-content">
          <h1 className="revamped-hero-heading">Get Your Business Listed Today</h1>
          <p className="revamped-hero-subheading">
            Join thousands of local businesses on ExploreLocal!
          </p>
        </div>
        <div className="revamped-progress-indicator">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const adjustedStep = isSignedIn && stepNumber >= 7 ? stepNumber + 1 : stepNumber;
            return (
              <div key={i} className="revamped-step-wrapper">
                <div
                  className={`revamped-step ${step === adjustedStep ? 'active' : ''} ${
                    step > adjustedStep ? 'completed' : ''
                  }`}
                  onClick={() => handleStepClick(stepNumber)}
                >
                  {stepNumber}
                </div>
                {i < totalSteps - 1 && <div className="revamped-step-connector"></div>}
              </div>
            );
          })}
        </div>
        <div className="revamped-grey-container">
          <div className="form-step">
            <h1>Choose Your Business Categories</h1>
            <p>
              Help us match {formData.businessName} with the right audience by choosing up to three categories that best represent your business.
            </p>

            <div className="category-grid">
              {categoriesList.map((category) => (
                <div
                  key={category}
                  className={`category-tile ${
                    selectedCategories.includes(category) ? 'selected' : ''
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryToggle(category)}
                  aria-label={`Select ${category} category`}
                >
                  {category}
                </div>
              ))}
            </div>

            {errors.categories && (
              <span id="categories-error" className="error">{errors.categories}</span>
            )}

            <button className="revamped-continue-button" onClick={nextStep}>
              Continue
            </button>
          </div>
        </div>
      </div>

      <footer className="revamped-footer">
        <div className="revamped-footer-content">
          <div className="revamped-footer-logo">
            <span className="logo-explore">Explore</span>
            <span className="logo-local">Local</span>
          </div>
          <div className="revamped-footer-links">
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="revamped-social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>
        <div className="revamped-copyright">
          © ExploreLocal 2025 All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}