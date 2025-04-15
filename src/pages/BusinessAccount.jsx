import React from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
    navigateToStep,
  } = useBusinessForm();

  // Set total steps based on authentication status
  const totalSteps = isSignedIn ? 9 : 10;

  const handleStepClick = (stepNumber) => {
    const adjustedStepNumber = isSignedIn && stepNumber >= 7 ? stepNumber + 1 : stepNumber;
    navigateToStep(adjustedStepNumber);
  };

  // Step 7.5: Verify Your Email
  if (step === 7.5) {
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
            <div className="form-step">
              <h1>Verify Your Email</h1>
              <p>
                We’ve sent a verification code to {formData.emailaddress}. Please enter it below.
              </p>
              <div className="verification-input">
                <input
                  type="text"
                  className="revamped-input"
                  placeholder="Verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  aria-describedby="verification-error"
                />
                {errors.verification && (
                  <span id="verification-error" className="error">{errors.verification}</span>
                )}
              </div>
              <div className="verify-group">
                <button className="revamped-continue-button" onClick={nextStep}>
                  Verify and Continue
                </button>
                <button className="revamped-resend-button" onClick={resendVerificationCode}>
                  Resend Code
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

  // Step 7: Create Business Account (if not signed in)
  if (!isSignedIn && step === 7) {
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
            <div className="form-step">
              <h1>Create Your Business Account</h1>
              <p>
                With a business account, you can manage your page, upload photos, and interact with reviews on our platform.
              </p>

              <div className="full-name">
                <div className="first-name">
                  <input
                    type="text"
                    name="firstName"
                    className="revamped-input"
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
                    className="revamped-input"
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
                  className="revamped-input"
                  placeholder="Email address"
                  value={formData.emailaddress}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="emailaddress-error"
                />
                {errors.emailaddress && (
                  <span id="emailaddress-error" className="error">{errors.emailaddress}</span>
                )}
              </div>

              <div className="password">
                <input
                  type="password"
                  name="password"
                  className="revamped-input"
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

              <button className="revamped-continue-button" onClick={nextStep}>
                Continue
              </button>

              <div className="signup-separator">
                <span className="separator"></span>
                <p>or</p>
                <span className="separator"></span>
              </div>

              <button className="revamped-google-button" onClick={signInWithGoogle} disabled={false}>
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