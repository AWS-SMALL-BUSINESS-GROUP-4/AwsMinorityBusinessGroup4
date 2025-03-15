import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessForm } from './BusinessFormContext';
import { stepToRouteMap } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessDescription() {
  const {
    step,
    setStep,
    formData,
    handleInputChange,
    isStepComplete,
    nextStep,
    prevStep
  } = useBusinessForm();
  const navigate = useNavigate();

  function handleSidebarClick(e, targetStep) {
    e.preventDefault();
    setStep(targetStep);
    navigate(stepToRouteMap[targetStep]);
  }

  return (
    <div className="form-container">
      <header className="header">
        <div className="nav-content">
          <div className="header-left">
            <span className="logo-text">Logo</span>
            <span className="for-businesses">for Businesses</span>
          </div>
          <nav className="header-nav">
            <a href="#">My Business</a>
            <a href="#">Account Settings</a>
            <a href="#">Support</a>
          </nav>
        </div>
      </header>

      <div className="form-area step8-wrapper">
        <div className="sidebar">
          <a
            href="#"
            className={step === 8 ? 'active' : ''}
            onClick={(e) => handleSidebarClick(e, 8)}
          >
            Business hours
          </a>
          <a
            href="#"
            className={step === 9 ? 'active' : ''}
            onClick={(e) => handleSidebarClick(e, 9)}
          >
            Description
          </a>
          <a
            href="#"
            className={step === 10 ? 'active' : ''}
            onClick={(e) => handleSidebarClick(e, 10)}
          >
            Photos
          </a>
        </div>

        <div className="step8-content">
          <div className="grey-container wide">
            <div className="form-step">
              <h1>Description</h1>
              <p>
                Share a short description that highlights your business and sets you apart
                from competitors. <strong>What makes you stand out?</strong>
              </p>
              <textarea
                name="description"
                placeholder="Showcase what makes your business truly unique..."
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
              />
              <div className="button-group step8-buttons">
                <button
                  className={`continue-button save-continue-button ${
                    !isStepComplete(step) ? 'disabled' : ''
                  }`}
                  onClick={nextStep}
                  disabled={!isStepComplete(step)}
                >
                  Save and continue
                </button>
                <button className="skip-button" onClick={nextStep}>
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="right-space"></div>
      </div>
    </div>
  );
}
