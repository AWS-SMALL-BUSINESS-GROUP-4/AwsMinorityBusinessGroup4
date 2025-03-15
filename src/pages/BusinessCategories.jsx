import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessCategories() {
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
            <h1>What type of business do you run?</h1>
            <p>
              Help people find your products and services by choosing up to three categories
              that best fit {formData.businessName}’s main focus. You can always edit or
              add more later.
            </p>

            <input
              type="text"
              name="categories"
              placeholder="Business categories"
              value={formData.categories}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              aria-describedby="categories-error"
            />
            {errors.categories && (
              <span id="categories-error" className="error">{errors.categories}</span>
            )}

            <div className="button-group">
              <button className="continue-button" onClick={nextStep}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
