import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessEmail() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
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
            <h1>What's your business email address?</h1>
            <p>
              We’ll use this email to send you important updates and requests from potential
              customers. You’ll also need it to sign in and oversee your business listing.
              Don’t worry—we won’t share it publicly or display it on your profile.
            </p>

            <input
              type="email"
              name="email"
              placeholder="Your business email address"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              aria-describedby="email-error"
            />
            {errors.email && (
              <span id="email-error" className="error">{errors.email}</span>
            )}

            <button className="continue-button" onClick={nextStep}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
