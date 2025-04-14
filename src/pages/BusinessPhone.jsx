import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BusinessCreationForm.css';

export default function BusinessPhone() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    nextStep,
    prevStep,
    isSignedIn,
    navigateToStep,
  } = useBusinessForm();

  const totalSteps = isSignedIn ? 9 : 10;

  const handleStepClick = (stepNumber) => {
    navigateToStep(stepNumber);
  };

  return (
    <div className="form-container">
      <header className="header revamped-header">
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
          <h1 className="revamped-hero-heading">
            Get Your Business Listed Today
          </h1>
          <p className="revamped-hero-subheading">
            Join thousands of local businesses on ExploreLocal!
          </p>
        </div>
        <div className="grey-container revamped-grey-container">
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
          <div className="form-step">
            <h1>How can we reach you? Enter your business phone number.</h1>
            <p>
              We’ll use your phone number for essential account communications and to verify your listing.
            </p>
            <label htmlFor="phoneNumber" className="input-label">
              Business Phone Number
            </label>
            <div className="phone-input">
              <select className="country-code revamped-input" name="countryCode">
                <option value="+1">+1</option>
              </select>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="(555) 123-4567"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                aria-describedby="phoneNumber-error"
                className="revamped-input"
              />
            </div>
            {errors.phoneNumber && (
              <span id="phoneNumber-error" className="error">
                {errors.phoneNumber}
              </span>
            )}
            <button className="continue-button revamped-continue-button" onClick={nextStep}>
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
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
        <div className="revamped-copyright">© ExploreLocal 2025 All Reserved.</div>
      </footer>
    </div>
  );
}