import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BusinessCreationForm.css';

export default function BusinessEmail() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    nextStep,
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
        <div className="grey-container revamped-grey-container">
          <div className="form-step">
            <h1>What's Your Business Email Address?</h1>
            <p>
              We’ll use this email to send important updates and inquiries from potential customers.
            </p>
            <label htmlFor="email" className="input-label">
              Business Email Address
              <span className="info-tooltip">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="info-icon"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="#666666"
                  />
                </svg>
                <span className="tooltip-text">
                  This email will be used for updates and customer inquiries.
                </span>
              </span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@business.com"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              aria-describedby="email-error"
              className="revamped-input"
            />
            {errors.email && (
              <span id="email-error" className="error">{errors.email}</span>
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