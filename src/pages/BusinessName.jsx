import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
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
            <h1>Let's start with your business name!</h1>
            <p>
              Search for your business. If you can't find it, you can add a new listing to
              get your business up and running in no time.
            </p>

            <div className="search-container">
              <input
                type="text"
                name="businessName"
                placeholder="Your business name"
                value={formData.businessName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                aria-describedby="businessName-error"
              />
              {errors.businessName && (
                <span id="businessName-error" className="error">
                  {errors.businessName}
                </span>
              )}
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

            <button className="continue-button" onClick={nextStep}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
