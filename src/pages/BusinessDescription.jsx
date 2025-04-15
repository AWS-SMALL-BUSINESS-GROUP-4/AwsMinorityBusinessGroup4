import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BusinessCreationForm.css';

export default function BusinessDescription() {
  const {
    step,
    isSignedIn,
    formData,
    handleInputChange,
    handleBlur,
    isStepComplete,
    nextStep,
    prevStep,
    navigateToStep,
  } = useBusinessForm();

  // Set total steps based on authentication status
  const totalSteps = isSignedIn ? 9 : 10; // 9 steps for signed-in users (1-6, 8-10)

  // Map UI step numbers to backend step numbers
  const uiStepToBackendStep = (uiStep) => {
    if (isSignedIn) {
      if (uiStep <= 6) return uiStep; // Steps 1-6 are the same
      if (uiStep === 7) return 8; // UI step 7 is Business Hours (backend step 8)
      if (uiStep === 8) return 9; // UI step 8 is Business Description (backend step 9)
      if (uiStep === 9) return 10; // UI step 9 is Business Photos (backend step 10)
    }
    return uiStep; // For non-signed-in users, UI step matches backend step
  };

  // Map backend step numbers to UI step numbers for display
  const backendStepToUiStep = (backendStep) => {
    if (isSignedIn) {
      if (backendStep <= 6) return backendStep;
      if (backendStep === 8) return 7;
      if (backendStep === 9) return 8;
      if (backendStep === 10) return 9;
    }
    return backendStep;
  };

  const handleStepClick = (uiStep) => {
    const backendStep = uiStepToBackendStep(uiStep);
    navigateToStep(backendStep);
  };

  // Step 9: Business Description
  if (step === 9) {
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
              const uiStep = i + 1;
              const backendStep = uiStepToBackendStep(uiStep);
              const currentUiStep = backendStepToUiStep(step);
              return (
                <div key={i} className="revamped-step-wrapper">
                  <div
                    className={`revamped-step ${currentUiStep === uiStep ? 'active' : ''} ${
                      currentUiStep > uiStep ? 'completed' : ''
                    }`}
                    onClick={() => handleStepClick(uiStep)}
                  >
                    {uiStep}
                  </div>
                  {i < totalSteps - 1 && <div className="revamped-step-connector"></div>}
                </div>
              );
            })}
          </div>
          <div className="revamped-grey-container revamped-grey-container--description">
            <div className="form-step">
              <h1>Describe Your Business</h1>
              <p>
                Share key details about your business—your mission, services, and what makes you unique. This information will help customers connect with your brand.
              </p>
              <textarea
                name="description"
                className="revamped-input revamped-textarea"
                placeholder="Enter a detailed description of your business here..."
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                rows="8"
              />
              <div className="revamped-button-group">
                <button
                  className={`revamped-continue-button ${
                    !isStepComplete(step) ? 'disabled' : ''
                  }`}
                  onClick={nextStep}
                  disabled={!isStepComplete(step)}
                >
                  Save and Continue
                </button>
                <button className="revamped-skip-button" onClick={nextStep}>
                  Skip for now
                </button>
              </div>
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

  return null;
}