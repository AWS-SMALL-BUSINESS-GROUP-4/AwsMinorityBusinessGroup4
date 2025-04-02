import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessForm } from './BusinessFormContext';
import { stepToRouteMap } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessPhotos() {
  const {
    step,
    setStep,
    formData,
    handleInputChange,
    handleRemovePhoto,
    isStepComplete,
    nextStep,
    prevStep,
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
              <h1>Photos</h1>
              <p>
                Photos play a key role in showcasing your business. Upload multiple images to
                help potential customers learn about—and choose—you over the competition.
              </p>

              <div className="photo-upload">
                <input
                  type="file"
                  name="photos"
                  multiple
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  id="photo-upload-input"
                />
                <label htmlFor="photo-upload-input" className="photo-upload-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16l-4-4-4 4"></path>
                    <path d="M12 12v9"></path>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                    <path d="M16 16l-4-4-4 4"></path>
                  </svg>
                  <span>Drag and drop or click to upload</span>
                </label>

                {formData.photos.length > 0 && (
                  <div className="uploaded-photos">
                    {formData.photos.map((url, index) => (
                      <div key={index} className="photo-preview">
                        <img src={url} alt={`Uploaded photo ${index + 1}`} />
                        <button
                          className="remove-photo-btn"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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