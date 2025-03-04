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

  const requiredFields = {
	1: ['businessName'],
	2: ['email'],
	3: ['phoneNumber'],
	4: [], // Optional due to "I don't have a website" option
	5: ['categories'],
	6: ['street', 'city', 'state', 'zip', 'country'],
	7: ['firstName', 'lastName', 'emailaddress', 'password'],
	8: [], // Optional with "Skip for now"
	9: [], // Optional with "Skip for now"
	10: [], // Optional with "Skip for now"
  };

  const toTitleCase = (str) => {
	return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  };

  const validateStep = (step, formData) => {
	const errors = {};
	const fields = requiredFields[step] || [];
	fields.forEach((field) => {
	  if (!formData[field].trim()) {
		errors[field] = `${toTitleCase(field)} is required`;
	  }
	});
	return errors;
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
	  // Clear error when user types
	  if (value.trim() !== '') {
		setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
	  }
	}
  };

  const handleHoursChange = (index, field, value) => {
	setFormData((prev) => {
	  const updatedHours = [...prev.businessHours];
	  updatedHours[index][field] = value;
	  return { ...prev, businessHours: updatedHours };
	});
  };

  const nextStep = () => {
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
				  />
				  {errors.businessName && (
					<span className="error">{errors.businessName}</span>
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
				/>
				{errors.email && <span className="error">{errors.email}</span>}
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
				  />
				</div>
				{errors.phoneNumber && (
				  <span className="error">{errors.phoneNumber}</span>
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
				/>
				<div className="button-group">
				  <button className="continue-button" onClick={nextStep}>
					Continue
				  </button>
				  <button className="no-website-button" onClick={nextStep}>
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
				/>
				{errors.categories && (
				  <span className="error">{errors.categories}</span>
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
							// className="street"
							type="text"
							name="street"
							placeholder="Street Address"
							value={formData.street}
							onChange={handleInputChange}
						/>
						{errors.street && <div className="error">{errors.street}</div>}
					</div>
					<div className="apt">
						<input
							// className="apt"
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
						/>
						{errors.city && <span className="error">{errors.city}</span>}
					</div>
					<div className="state">
						<input
							type="text"
							name="state"
							placeholder="State"
							value={formData.state}
							onChange={handleInputChange}
						/>
						{errors.state && <span className="error">{errors.state}</span>}
					</div>
					<div className="zip">
						<input
							type="text"
							name="zip"
							placeholder="Zip Code"
							value={formData.zip}
							onChange={handleInputChange}
						/>
						{errors.zip && <span className="error">{errors.zip}</span>}
					</div>
					<div className="country">
						<input
							type="text"
							name="country"
							placeholder="Country"
							value={formData.country}
							onChange={handleInputChange}
						/>
						{errors.country && <span className="error">{errors.country}</span>}
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
						/>
						{errors.firstName && (
							<span className="error">{errors.firstName}</span>
						)}
					</div>
					<div className="last-name">
						<input
							type="text"
							name="lastName"
							placeholder="Last name"
							value={formData.lastName}
							onChange={handleInputChange}
						/>
						{errors.lastName && (
							<span className="error">{errors.lastName}</span>
						)}
					</div>
				</div>
				<div className="emailaddress">
					<input
					type="text"
					name="emailaddress"
					placeholder="Email address"
					value={formData.emailaddress}
					onChange={handleInputChange}
					/>
					{errors.emailaddress && (
					<span className="error">{errors.emailaddress}</span>
					)}
				</div>
				<div className="password">
					<input
					type="password"
					name="password"
					placeholder="Password"
					value={formData.password}
					onChange={handleInputChange}
					/>
					{errors.password && (
					<span className="error">{errors.password}</span>
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
							  handleHoursChange(index, 'openTime', e.target.value)
							}
						  />
						</div>
						<div className="time-select">
						  <label>Closes at</label>
						  <input
							type="time"
							value={dayObj.closeTime}
							onChange={(e) =>
							  handleHoursChange(index, 'closeTime', e.target.value)
							}
						  />
						</div>
					  </div>
					  <div className="checkbox-group">
						<div id="isopen24">
						  <input
							className="checkbox"
							type="checkbox"
							checked={dayObj.isOpen24}
							onChange={(e) =>
							  handleHoursChange(index, 'isOpen24', e.target.checked)
							}
						  />
						  Open 24 hours
						</div>
						<div id="isclosed">
						  <input
							className="checkbox"
							type="checkbox"
							checked={dayObj.isClosed}
							onChange={(e) =>
							  handleHoursChange(index, 'isClosed', e.target.checked)
							}
						  />
						  Closed
						</div>
					  </div>
					</div>
				  ))}
				</div>
				<div className="button-group step8-buttons">
				  <button className="continue-button save-continue-button" onClick={nextStep}>
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
				  <button className="continue-button save-continue-button" onClick={nextStep}>
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
				  <button className="continue-button save-continue-button" onClick={nextStep}>
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
	</div>
  );
};

export default MultiStepForm;