import React, { useState } from 'react';
import './BusinessCreationForm.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */


const client = generateClient({
  authMode: "userPool",
});

const BusinessCreationForm = () => {
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
    description: '',
    photos: [],
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
  const [errors, setErrors] = useState({});

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).{8,}$/;
  const phoneRegex = /^\d{10}$/;
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const requiredFields = {
    1: ['businessName'],
    2: ['email'],
    3: ['phoneNumber'],
    4: [], // Website is optional but validated conditionally
    5: ['categories'],
    6: ['street', 'city', 'state', 'zip', 'country'],
    7: ['firstName', 'lastName', 'emailaddress', 'password'],
    8: [], // Business hours will have custom validation
    9: [], // Description will have custom validation
    10: [], // Photos will have custom validation
  };

  const fieldDisplayNames = {
    businessName: 'Business Name',
    email: 'Business Email',
    phoneNumber: 'Phone Number',
    website: 'Website',
    categories: 'Business Categories',
    street: 'Street Address',
    city: 'City',
    state: 'State',
    zip: 'Zip Code',
    country: 'Country',
    firstName: 'First Name',
    lastName: 'Last Name',
    emailaddress: 'Email Address',
    password: 'Password',
  };

  const toTitleCase = (str) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  };

  const validateField = (field, value) => {
    if (requiredFields[step].includes(field) && !value.trim()) {
      return `${fieldDisplayNames[field] || toTitleCase(field)} is required`;
    }
    if (field === 'email' || field === 'emailaddress') {
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    } else if (field === 'password') {
      if (!passwordRegex.test(value)) {
        return 'Password must be at least 8 characters long and include letters, numbers, and symbols';
      }
    } else if (field === 'phoneNumber') {
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid 10-digit phone number';
      }
    } else if (field === 'website' && value.trim() && !urlRegex.test(value)) {
      return 'Please enter a valid website URL (e.g., https://example.com)';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photos') {
      setFormData((prevState) => ({
        ...prevState,
        photos: Array.from(files),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      const error = validateField(name, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleHoursChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedHours = [...prev.businessHours];
      if (field === 'isOpen24') {
        updatedHours[index].isOpen24 = value;
        if (value) {
          updatedHours[index].openTime = '00:00'; // 12:00 AM
          updatedHours[index].closeTime = '00:00'; // 12:00 AM
          updatedHours[index].isClosed = false; // Uncheck "Closed"
        } else {
          updatedHours[index].openTime = '';
          updatedHours[index].closeTime = '';
        }
      } else if (field === 'isClosed') {
        updatedHours[index].isClosed = value;
        if (value) {
          updatedHours[index].isOpen24 = false; // Uncheck "Open 24 hours"
          updatedHours[index].openTime = ''; // Clear "Opens at"
          updatedHours[index].closeTime = ''; // Clear "Closes at"
        }
      } else {
        updatedHours[index][field] = value;
      }
      return { ...prev, businessHours: updatedHours };
    });
  };

  const isStepComplete = (step) => {
    if (step === 8) {
      return formData.businessHours.every((day) => {
        if (day.isOpen24 || day.isClosed) {
          return true;
        }
        return day.openTime && day.closeTime;
      });
    } else if (step === 9) {
      return formData.description.trim() !== '';
    } else if (step === 10) {
      // Validate all required fields for Step 10
      return (
        formData.businessName &&
        formData.email &&
        formData.phoneNumber &&
        formData.categories &&
        formData.street &&
        formData.city &&
        formData.state &&
        formData.zip &&
        formData.country &&
        formData.firstName &&
        formData.lastName &&
        formData.emailaddress &&
        formData.password &&
        formData.description &&
        formData.photos.length > 0
      );
    }
    return true; // For other steps, assume complete (for now)
  };

  const validateStep = (step, formData) => {
    const errors = {};
    const fields = requiredFields[step] || [];
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });
    if (step === 4 && formData.website.trim() && !urlRegex.test(formData.website)) {
      errors.website = 'Please enter a valid website URL (e.g., https://example.com)';
    }
    return errors;
  };

  const nextStep = () => {
    if (step === 4) {
      if (!formData.website.trim()) {
        setErrors({ website: 'Website is required to continue' });
        return;
      } else if (!urlRegex.test(formData.website)) {
        setErrors({ website: 'Please enter a valid website URL (e.g., https://example.com)' });
        return;
      }
    }
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setErrors({});
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const skipWebsite = () => {
    setErrors({});
    setStep(step + 1);
  };

  const createUser = async () => {
    try {
      const { errors, data: newUser } = await client.models.User.create({
        name: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        email: formData.emailaddress,
      });
  
      if (errors) {
        console.error('Error creating user:', errors);
        throw new Error('Failed to create user');
      }
  
      console.log('New user created:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error during user creation:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate website before proceeding
      if (formData.website.trim() && !urlRegex.test(formData.website)) {
        alert('Please enter a valid website URL (e.g., https://example.com)');
        return;
      }

      console.log('Form data:', formData); // Log the form data
  
      // Step 1: Create a User
      const newUser = await createUser();

      // Step 2: Upload Photos to S3 (if applicable)
      const photoUrls = [];
      if (formData.photos.length > 0) {
        for (const photo of formData.photos) {
          const fileKey = `businesses/${newUser.id}/photos/${Date.now()}-${photo.name}`; // Path for business photos
          const result = await uploadData({
            path: fileKey,
            data: photo,
            options: {
              bucket: 'awsmbg4-private', // Use the private bucket
            },
          });
          console.log('Photo upload result:', result);
          photoUrls.push(fileKey);
        }
      }
  
      // Step 3: Create a Business linked to the User
      const businessData = {
        businessOwnerId: newUser.id, // Link the business to the user
        name: formData.businessName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        website: formData.website.trim() || null,
        category: formData.categories,
        streetAddress: formData.street,
        aptSuiteOther: formData.apt,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zip,
        country: formData.country,
        location: {
          lattitude: 0, // Replace with actual latitude
          longitude: 0, // Replace with actual longitude
        },
        businessHours: formData.businessHours,
        description: formData.description,
        photos: photoUrls, // Use the S3 keys instead of object URLs
      };
  
      console.log('Business data to be saved:', businessData); // Log the data being sent
  
      // Create the business in the backend
      const { errors, data: newBusiness } = await client.models.Business.create(businessData);
  
      if (errors) {
        console.error('Error creating business:', errors);
        alert('Failed to create business. Please try again.');
        return;
      }
  
      console.log('New business created:', newBusiness); // Log the response
      alert('Business created successfully!');

      // Reset the form or navigate to another page
      setStep(1);
      setFormData({
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
        description: '',
        photos: [],
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
    } catch (error) {
      console.error('Error during business creation:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

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
                    onBlur={handleBlur}
                    required
                    aria-describedby="businessName-error"
                  />
                  {errors.businessName && (
                    <span id="businessName-error" className="error">{errors.businessName}</span>
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
            )}

            {step === 2 && (
              <div className="form-step">
                <h1>What's your business email address?</h1>
                <p>
                  We’ll use this email to send you important updates and requests from potential customers. You’ll also need it to sign in and oversee your business listing. Don’t worry—we won’t share it publicly or display it on your profile.
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
                {errors.email && <span id="email-error" className="error">{errors.email}</span>}
                <button className="continue-button" onClick={nextStep}>
                  Continue
                </button>
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
                    onBlur={handleBlur}
                    required
                    aria-describedby="phoneNumber-error"
                  />
                </div>
                {errors.phoneNumber && (
                  <span id="phoneNumber-error" className="error">{errors.phoneNumber}</span>
                )}
                <button className="continue-button" onClick={nextStep}>
                  Continue
                </button>
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
            )}

            {step === 5 && (
              <div className="form-step">
                <h1>What type of business do you run?</h1>
                <p>
                  Help people find your products and services by choosing up to three categories that best fit {formData.businessName}’s main focus. You can always edit or add more later.
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
            )}

            {step === 6 && (
              <div className="form-step">
                <h1>Where is your business located?</h1>
                <p>Enter the address where customers can find you, or provide your official registered address.</p>
                <div className="innerLocation">
                  <div className="street">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-describedby="street-error"
                    />
                    {errors.street && <span id="street-error" className="error">{errors.street}</span>}
                  </div>
                  <div className="apt">
                    <input
                      type="text"
                      name="apt"
                      placeholder="Apt/Suite/Other"
                      value={formData.apt}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="outerLocation">
                  <div className="city">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-describedby="city-error"
                    />
                    {errors.city && <span id="city-error" className="error">{errors.city}</span>}
                  </div>
                  <div className="state">
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-describedby="state-error"
                    />
                    {errors.state && <span id="state-error" className="error">{errors.state}</span>}
                  </div>
                  <div className="zip">
                    <input
                      type="text"
                      name="zip"
                      placeholder="Zip Code"
                      value={formData.zip}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-describedby="zip-error"
                    />
                    {errors.zip && <span id="zip-error" className="error">{errors.zip}</span>}
                  </div>
                  <div className="country">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-describedby="country-error"
                    />
                    {errors.country && <span id="country-error" className="error">{errors.country}</span>}
                  </div>
                </div>
                <div className="button-group">
                  <button className="continue-button" onClick={nextStep}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="form-step">
                <h1>Great job so far! Now let’s create your business account.</h1>
                <p>With a business account, you can manage your page, upload photos, and interact with reviews on our platform.</p>
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
                    <span id="emailaddress-error" className="error">{errors.emailaddress}</span>
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
                  <button className="google-button">
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

      {step === 8 && (
        <div className="form-area step8-wrapper">
          <div className="sidebar">
            <a href="#" className={step === 8 ? 'active' : ''} onClick={() => setStep(8)}>
              Business hours
            </a>
            <a href="#" className={step === 9 ? 'active' : ''} onClick={() => setStep(9)}>
              Description
            </a>
            <a href="#" className={step === 10 ? 'active' : ''} onClick={() => setStep(10)}>
              Photos
            </a>
          </div>
          <div className="step8-content">
            <div className="grey-container wide">
              <div className="form-step">
                <h1>Business Hours</h1>
                <p>Let customers know when you’re open by adding your regular hours.</p>
                <div className="hours-list">
                  {formData.businessHours.map((dayObj, index) => (
                    <div key={index} className="day-row">
                      <div className="day-name">{dayObj.day}</div>
                      <div className="time-slot">
                        <div className="time-select">
                          <label>Opens at</label>
                          <input
                            type="time"
                            value={dayObj.openTime}
                            onChange={(e) =>
                              !dayObj.isOpen24 && !dayObj.isClosed && handleHoursChange(index, 'openTime', e.target.value)
                            }
                            disabled={dayObj.isOpen24 || dayObj.isClosed}
                          />
                        </div>
                        <div className="time-select">
                          <label>Closes at</label>
                          <input
                            type="time"
                            value={dayObj.closeTime}
                            onChange={(e) =>
                              !dayObj.isOpen24 && !dayObj.isClosed && handleHoursChange(index, 'closeTime', e.target.value)
                            }
                            disabled={dayObj.isOpen24 || dayObj.isClosed}
                          />
                        </div>
                      </div>
                      <div className="checkbox-group">
                        <div id="isopen24">
                          <input
                            className="checkbox"
                            type="checkbox"
                            checked={dayObj.isOpen24}
                            onChange={(e) => handleHoursChange(index, 'isOpen24', e.target.checked)}
                          />
                          Open 24 hours
                        </div>
                        <div id="isclosed">
                          <input
                            className="checkbox"
                            type="checkbox"
                            checked={dayObj.isClosed}
                            onChange={(e) => handleHoursChange(index, 'isClosed', e.target.checked)}
                          />
                          Closed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="button-group step8-buttons">
                  <button
                    className={`continue-button save-continue-button ${!isStepComplete(step) ? 'disabled' : ''}`}
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
      )}

      {step === 9 && (
        <div className="form-area step8-wrapper">
          <div className="sidebar">
            <a href="#" className={step === 8 ? 'active' : ''} onClick={() => setStep(8)}>
              Business hours
            </a>
            <a href="#" className={step === 9 ? 'active' : ''} onClick={() => setStep(9)}>
              Description
            </a>
            <a href="#" className={step === 10 ? 'active' : ''} onClick={() => setStep(10)}>
              Photos
            </a>
          </div>
          <div className="step8-content">
            <div className="grey-container wide">
              <div className="form-step">
                <h1>Description</h1>
                <p>Share a short description that highlights your business and sets you apart from competitors. <strong>What makes you stand out?</strong></p>
                <textarea
                  name="description"
                  placeholder="Showcase what makes your business truly unique..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                />
                <div className="button-group step8-buttons">
                  <button
                    className={`continue-button save-continue-button ${!isStepComplete(step) ? 'disabled' : ''}`}
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
      )}

      {step === 10 && (
        <div className="form-area step8-wrapper">
          <div className="sidebar">
            <a href="#" className={step === 8 ? 'active' : ''} onClick={() => setStep(8)}>
              Business hours
            </a>
            <a href="#" className={step === 9 ? 'active' : ''} onClick={() => setStep(9)}>
              Description
            </a>
            <a href="#" className={step === 10 ? 'active' : ''} onClick={() => setStep(10)}>
              Photos
            </a>
          </div>
          <div className="step8-content">
            <div className="grey-container wide">
              <div className="form-step">
                <h1>Photos</h1>
                <p>Photos play a key role in showcasing your business. Upload multiple images to help potential customers learn about—and choose—you over the competition.</p>
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
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="photo-preview">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Uploaded photo ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="button-group step8-buttons">
                  <button
                    className={`submit-button ${!isStepComplete(step) ? 'disabled' : ''}`}
                    onClick={handleSubmit} // Call handleSubmit here
                    disabled={!isStepComplete(step)}
                  >
                    Submit
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
      )}
    </div>
  );
};

const AuthenticatedBusinessForm = () => {
  return (
    <Authenticator>
      {({ signOut }) => (
        <BusinessCreationForm />
      )}
    </Authenticator>
  );
};

export default AuthenticatedBusinessForm;