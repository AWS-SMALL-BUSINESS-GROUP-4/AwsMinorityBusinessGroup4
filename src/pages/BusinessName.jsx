import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import './BusinessCreationForm.css';

export default function BusinessName() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    nextStep,
    prevStep,
    isSignedIn,
  } = useBusinessForm();

  const totalSteps = isSignedIn ? 9 : 10; // 9 if signed in (skips 7 & 7.5), 10 if not

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= step) {
      console.log(`Navigate to step ${stepNumber}`);
    }
  };

  return (
    <div className="form-container">
      <header className="header revamped-header">
        <div className="nav-content">
          <div className="header-left">
            <span className="logo-text revamped-logo">ExploreLocal</span>
          </div>
          <nav className="header-nav">
            <a href="#">Home</a>
            <a href="#">Support</a>
            <a href="#">Business Login</a>
          </nav>
        </div>
      </header>
      <div className="revamped-hero-section">
        <div className="grey-container">
          {step > 1 && (
            <button className="back-button" onClick={prevStep}>
              ←
            </button>
          )}
          <div className="revamped-progress-indicator">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNumber = i + 1;
              const adjustedStep = isSignedIn && stepNumber >= 7 ? stepNumber + 1 : stepNumber;
              return (
                <div
                  key={i}
                  className={`revamped-step ${step === adjustedStep ? 'active' : ''} ${
                    step > adjustedStep ? 'completed' : ''
                  }`}
                  onClick={() => handleStepClick(adjustedStep)}
                >
                  {stepNumber}
                </div>
              );
            })}
          </div>
          <div className="form-step">
            <h1>Let's Start With Your Business Name!</h1>
            <p>
              Search for your business, or if it's new, add a listing to get started.
            </p>
            <label htmlFor="businessName">Business Name</label>
            <div className="search-container">
              <input
                id="businessName"
                type="text"
                name="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                aria-describedby="businessName-error"
              />
              <button className="search-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                    fill="#666666"
                  />
                </svg>
              </button>
            </div>
            {errors.businessName && (
              <span id="businessName-error" className="error">
                {errors.businessName}
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
          <div className="revamped-footer-logo">ExploreLocal</div>
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