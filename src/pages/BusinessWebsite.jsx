import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessWebsite() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    skipWebsite,
    nextStep,
    prevStep,
  } = useBusinessForm();

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

      <div className="form-area">
        <div className="grey-container">
          {step > 1 && (
            <button className="back-button" onClick={prevStep}>
              ←
            </button>
          )}

          <div className="form-step">
            <h1>Do you have a business website?</h1>
            <p>
              Tell your customers where they can find more information about your business.
            </p>

            <input
              type="text"
              name="website"
              placeholder="Your business website"
              value={formData.website}
              onChange={handleInputChange}
              onBlur={handleBlur}
              aria-describedby="website-error"
            />
            {errors.website && (
              <span id="website-error" className="error">{errors.website}</span>
            )}

            <div className="button-group">
              <button className="continue-button" onClick={nextStep}>
                Continue
              </button>
              <button className="no-website-button" onClick={skipWebsite}>
                I don't have a website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
