import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
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
            <h1>Give customers a direct way to reach you by phone!</h1>
            <p>
              Add the phone number for {formData.businessName} so they can easily connect
              with your business.
            </p>

            <div className="phone-input">
              <select className="country-code">
                <option>+1</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Your business phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                aria-describedby="phoneNumber-error"
              />
            </div>
            {errors.phoneNumber && (
              <span id="phoneNumber-error" className="error">
                {errors.phoneNumber}
              </span>
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
