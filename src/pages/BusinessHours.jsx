import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BusinessCreationForm.css';

export default function BusinessHours() {
  const {
    step,
    isSignedIn,
    formData,
    handleHoursChange,
    isStepComplete,
    nextStep,
    prevStep,
    navigateToStep,
  } = useBusinessForm();

  // Set total steps based on authentication status
  const totalSteps = isSignedIn ? 9 : 10;

  const handleStepClick = (stepNumber) => {
    const adjustedStepNumber = isSignedIn && stepNumber >= 7 ? stepNumber + 1 : stepNumber;
    navigateToStep(adjustedStepNumber);
  };

  // Step 8: Business Hours
  if (step === 8) {
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
              const adjustedStep = isSignedIn && step >= 7 ? step - 1 : step;
              return (
                <div key={i} className="revamped-step-wrapper">
                  <div
                    className={`revamped-step ${adjustedStep === stepNumber ? 'active' : ''} ${
                      adjustedStep > stepNumber ? 'completed' : ''
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
            <div className="form-step-hours">
              <h1>Set Your Business Hours</h1>
              <p>Choose the days and times your business operates so customers know when to reach you.</p>
              <div className="hours-list">
                {formData.businessHours.map((dayObj, index) => (
                  <div key={index} className="revamped-day-row">
                    <div className="revamped-day-name">{dayObj.day}</div>
                    <div className="revamped-time-slot">
                      <div className="revamped-time-select">
                        <label className="input-label">Opens at</label>
                        <input
                          type="time"
                          className="revamped-input"
                          value={dayObj.openTime}
                          onChange={(e) =>
                            !dayObj.isOpen24 &&
                            !dayObj.isClosed &&
                            handleHoursChange(index, 'openTime', e.target.value)
                          }
                          disabled={dayObj.isOpen24 || dayObj.isClosed}
                        />
                      </div>
                      <div className="revamped-time-select">
                        <label className="input-label">Closes at</label>
                        <input
                          type="time"
                          className="revamped-input"
                          value={dayObj.closeTime}
                          onChange={(e) =>
                            !dayObj.isOpen24 &&
                            !dayObj.isClosed &&
                            handleHoursChange(index, 'closeTime', e.target.value)
                          }
                          disabled={dayObj.isOpen24 || dayObj.isClosed}
                        />
                      </div>
                    </div>
                    <div className="revamped-checkbox-group">
                      <label className="revamped-checkbox-label">
                        <input
                          type="checkbox"
                          className="revamped-checkbox"
                          checked={dayObj.isOpen24}
                          onChange={(e) => handleHoursChange(index, 'isOpen24', e.target.checked)}
                        />
                        <span className="revamped-checkbox-custom"></span>
                        Open 24 hours
                      </label>
                      <label className="revamped-checkbox-label">
                        <input
                          type="checkbox"
                          className="revamped-checkbox"
                          checked={dayObj.isClosed}
                          onChange={(e) => handleHoursChange(index, 'isClosed', e.target.checked)}
                        />
                        <span className="revamped-checkbox-custom"></span>
                        Closed
                      </label>
                    </div>
                  </div>
                ))}
              </div>

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