// MultiStepForm.jsx
import React, { useState } from 'react';
import './MultiStepForm.css';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    phoneNumber: '',
    email: '',
    categories: '',
    street: '',
    apt: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    firstName: '',
    lastName: '',
    emailaddress: '',
    password: '',
    // New field for business hours
    businessHours: [
      { day: 'Monday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
      { day: 'Tuesday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
      { day: 'Wednesday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
      { day: 'Thursday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
      { day: 'Friday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
      { day: 'Saturday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
      { day: 'Sunday', openTime: '', closeTime: '', isOpen24: false, isClosed: false },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handler for changing business hours
  const handleHoursChange = (index, field, value) => {
    setFormData(prev => {
      const updatedHours = [...prev.businessHours];
      updatedHours[index][field] = value;
      return { ...prev, businessHours: updatedHours };
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="form-container">
      {/* Header */}
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

      {/* For steps 1–7, we use the original layout. */}
      {step < 8 && (
        <div className="form-area">
          <div className="grey-container">
            {step > 1 && (
              <button className="back-button" onClick={prevStep}>←</button>
            )}

            {step === 1 && (
              <div className="form-step">
                <h1>Let's start with your business name!</h1>
                <p>
                  Search for your business. If you can't find it, you can add a new listing
                  to get your business up and running in no time
                </p>
                <div className="search-container">
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Your business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
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
                <button className="continue-button" onClick={nextStep}>Continue</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h1>What's your business email address?</h1>
                <p>
                  We'll use this email to send you important updates and requests from potential customers. 
                  You'll also need it to sign in and oversee your business listing. 
                  Don't worry—we won't share it publicly or display it on your profile.
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="Your business email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <button className="continue-button" onClick={nextStep}>Continue</button>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h1>Give customers a direct way to reach you by phone!</h1>
                <p>
                  Add the phone number for {formData.businessName} so they can easily connect with your business.
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
                  />
                </div>
                <button className="continue-button" onClick={nextStep}>Continue</button>
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <h1>Do you have a business website?</h1>
                <p>Tell your customers where they can find more information about your business.</p>
                <input
                  type="text"
                  name="website"
                  placeholder="Your business website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
                <div className="button-group">
                  <button className="continue-button" onClick={nextStep}>Continue</button>
                  <button className="no-website-button" onClick={nextStep}>I don't have a website</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="form-step">
                <h1>What type of business do you run?</h1>
                <p>
                  Help people find your products and services by choosing up to three categories 
                  that best fit 'business name’s main focus. You can always edit or add more later.
                </p>
                <input
                  type="text"
                  name="categories"
                  placeholder="Business categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                />
                <div className="button-group">
                  <button className="continue-button" onClick={nextStep}>Continue</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="form-step">
                <h1>Where is your business located?</h1>
                <p>
                  Enter the address where customers can find you, or provide your official registered address.
                </p>
                <div className='innerLocation'>
                  <input 
                    className='street'
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                  <input
                    className='apt'
                    type="text"
                    name="apt"
                    placeholder="Apt/Suite/Other"
                    value={formData.apt}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='outerLocation'>
                  <input
                    className='city'
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <input
                    className='state'
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  <input
                    className='zip'
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                  <input
                    className='country'
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="button-group">
                  <button className="continue-button" onClick={nextStep}>Continue</button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="form-step">
                <h1>Great job so far! Now let’s create your business account.</h1>
                <p>
                  With a business account, you can manage your page, upload photos, 
                  and interact with reviews on our platform.
                </p>
                <div className='full-name'>
                  <input 
                    className='first-name'
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <input
                    className='last-name'
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  className='emailaddress'
                  type="text"
                  name="emailaddress"
                  placeholder="Email address"
                  value={formData.emailaddress}
                  onChange={handleInputChange}
                />
                <input
                  className='password'
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="button-group">
                  <button className="continue-button" onClick={nextStep}>Continue</button>
                </div>
                <div className='signup-separator'>
                  <span className='separator'></span>
                  <p>or</p>
                  <span className='separator'></span>
                </div>
                <div className='button-group'>
                  <button className='google-button'>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/150px-Google_%22G%22_logo.svg.png"
                      alt="Google logo"
                      className="google-logo"
                    />
                    <span>Continue with Google</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* For step 8, we create a 3-column layout: sidebar, main content (grey box), and blank space. */}
      {step === 8 && (
        <div className="form-area step8-wrapper">
          {/* Left sidebar */}
          <div className="sidebar">
            <p className="active">Business hours</p>
            <p>Description</p>
            <p>Photos</p>
          </div>

          {/* Middle content */}
          <div className="step8-content">
            <div className="grey-container hours-container">
              <div className="form-step">
                <h1>Business Hours</h1>
                <p>Let customers know when you're open by adding your regular hours.</p>
                
                <div className="hours-list">
                  {formData.businessHours.map((dayObj, index) => (
                    <div key={index} className="day-row">
                      <div className="day-name">{dayObj.day}</div>
                      <div className="time-select">
                        <label>Opens at</label>
                        <input
                          type="time"
                          value={dayObj.openTime}
                          onChange={(e) => handleHoursChange(index, 'openTime', e.target.value)}
                        />
                      </div>
                      <div className="time-select">
                        <label>Closes at</label>
                        <input
                          type="time"
                          value={dayObj.closeTime}
                          onChange={(e) => handleHoursChange(index, 'closeTime', e.target.value)}
                        />
                      </div>
                      <div className="checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={dayObj.isOpen24}
                            onChange={(e) => handleHoursChange(index, 'isOpen24', e.target.checked)}
                          />
                          Open 24 hours
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={dayObj.isClosed}
                            onChange={(e) => handleHoursChange(index, 'isClosed', e.target.checked)}
                          />
                          Closed
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="button-group">
                  <button className="continue-button" onClick={nextStep}>Continue</button>
                </div>
              </div>
            </div>
          </div>

          {/* Blank space on the right */}
          <div className="right-space"></div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
