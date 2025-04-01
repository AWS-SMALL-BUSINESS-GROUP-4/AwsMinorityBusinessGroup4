// BusinessAccount.jsx
import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessAccount() {
  const {
    step,
    isSignedIn,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    nextStep,
    prevStep,
    verificationCode,
    setVerificationCode,
    signInWithGoogle,
    resendVerificationCode,
  } = useBusinessForm();

  // If step === 7.5, show the "Verify Your Email" portion
  if (step === 7.5) {
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
            <button className="back-button" onClick={prevStep}>
              ←
            </button>
            <div className="form-step">
              <h1>Verify Your Email</h1>
              <p>
                We’ve sent a verification code to {formData.emailaddress}. Please enter it below.
              </p>
              <input
                type="text"
                placeholder="Verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                aria-describedby="verification-error"
              />
              {errors.verification && (
                <span id="verification-error" className="error">{errors.verification}</span>
              )}
              <div className="button-group">
                <button className="continue-button" onClick={nextStep}>
                  Verify and Continue
                </button>
                <button className="resend-button" onClick={resendVerificationCode}>
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If step === 7 and user is not signed in, show the sign-up form
  if (!isSignedIn && step === 7) {
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
            <button className="back-button" onClick={prevStep}>
              ←
            </button>

            <div className="form-step">
              <h1>Great job so far! Now let’s create your business account.</h1>
              <p>
                With a business account, you can manage your page, upload photos, and
                interact with reviews on our platform.
              </p>

              <div className="full-name">
                <div className="first-name">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    aria-describedby="firstName-error"
                  />
                  {errors.firstName && (
                    <span id="firstName-error" className="error">{errors.firstName}</span>
                  )}
                </div>
                <div className="last-name">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    aria-describedby="lastName-error"
                  />
                  {errors.lastName && (
                    <span id="lastName-error" className="error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="emailaddress">
                <input
                  type="email"
                  name="emailaddress"
                  placeholder="Email address"
                  value={formData.emailaddress}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="emailaddress-error"
                />
                {errors.emailaddress && (
                  <span id="emailaddress-error" className="error">
                    {errors.emailaddress}
                  </span>
                )}
              </div>

              <div className="password">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <span id="password-error" className="error">{errors.password}</span>
                )}
                {errors.manualSignUp && (
                  <span className="error">{errors.manualSignUp}</span>
                )}
              </div>

              <div className="button-group">
                <button className="continue-button" onClick={nextStep}>
                  Continue
                </button>
              </div>

              <div className="signup-separator">
                <span className="separator"></span>
                <p>or</p>
                <span className="separator"></span>
              </div>

              <div className="button-group">
                <button className="google-button" onClick={signInWithGoogle} disabled={false}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/150px-Google_%22G%22_logo.svg.png"
                    alt="Google logo"
                    className="google-logo"
                  />
                  <span>Continue with Google</span>
                </button>
                {errors.google && <span className="error">{errors.google}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}