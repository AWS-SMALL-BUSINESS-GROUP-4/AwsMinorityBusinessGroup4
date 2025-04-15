import React, { useState, useEffect, useRef } from 'react';
import { useBusinessForm } from './BusinessFormContext';
import { FaFacebookF, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BusinessCreationForm.css';

export default function BusinessAddress() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    nextStep,
    setFormData,
    isSignedIn,
    navigateToStep,
  } = useBusinessForm();

  const totalSteps = isSignedIn ? 9 : 10;

  const handleStepClick = (stepNumber) => {
    navigateToStep(stepNumber);
  };

  // Local states for Google Maps, inputs, and predictions for each field.
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  // Street state and predictions
  const [streetInput, setStreetInput] = useState(formData.street || '');
  const [streetPredictions, setStreetPredictions] = useState([]);

  // City state and predictions
  const [cityInput, setCityInput] = useState(formData.city || '');
  const [cityPredictions, setCityPredictions] = useState([]);

  // State (region) state and predictions
  const [stateInput, setStateInput] = useState(formData.state || '');
  const [statePredictions, setStatePredictions] = useState([]);

  // Zip state and predictions
  const [zipInput, setZipInput] = useState(formData.zip || '');
  const [zipPredictions, setZipPredictions] = useState([]);

  // Country state and predictions
  const [countryInput, setCountryInput] = useState(formData.country || '');
  const [countryPredictions, setCountryPredictions] = useState([]);

  const autocompleteServiceRef = useRef(null);
  // Use a hidden div for the PlacesService (so we don’t rely on an input ref)
  const placesServiceDivRef = useRef(null);
  const placesServiceRef = useRef(null);
  // A ref for the street input element.
  const streetInputRef = useRef(null);

  // Load the Google Maps script (if not already loaded)
  useEffect(() => {
    const apiKey = import.meta.env.VITE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing (VITE_PLACES_API_KEY)!');
      return;
    }
    if (!document.querySelector('script[data-places-loaded]')) {
      const script = document.createElement('script');
      script.setAttribute('data-places-loaded', 'true');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          setIsMapsLoaded(true);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };
      document.head.appendChild(script);
    } else {
      if (window.google && window.google.maps) {
        setIsMapsLoaded(true);
      }
    }
  }, []);

  // Once Maps is loaded, create the AutocompleteService and PlacesService.
  useEffect(() => {
    if (isMapsLoaded && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
    if (isMapsLoaded && !placesServiceRef.current) {
      if (!placesServiceDivRef.current) {
        placesServiceDivRef.current = document.createElement('div');
      }
      placesServiceRef.current = new window.google.maps.places.PlacesService(placesServiceDivRef.current);
    }
  }, [isMapsLoaded]);

  // Helper to extract a specific address component.
  const getComponent = (addressComponents, types) =>
    addressComponents.find(comp => types.every(type => comp.types.includes(type)))?.long_name || '';

  // Generic function to handle a prediction click.
  const handleFieldPredictionClick = (field, prediction) => {
    // Clear the prediction list for the given field.
    const clearPrediction = () => {
      switch (field) {
        case 'street':
          setStreetPredictions([]);
          break;
        case 'city':
          setCityPredictions([]);
          break;
        case 'state':
          setStatePredictions([]);
          break;
        case 'zip':
          setZipPredictions([]);
          break;
        case 'country':
          setCountryPredictions([]);
          break;
        default:
          break;
      }
    };

    // Update local input state for the field.
    const updateInput = (value) => {
      switch (field) {
        case 'street':
          setStreetInput(value);
          break;
        case 'city':
          setCityInput(value);
          break;
        case 'state':
          setStateInput(value);
          break;
        case 'zip':
          setZipInput(value);
          break;
        case 'country':
          setCountryInput(value);
          break;
        default:
          break;
      }
    };

    updateInput(prediction.description);
    clearPrediction();

    // Get details for the selected place.
    if (isMapsLoaded && window.google && placesServiceRef.current) {
      placesServiceRef.current.getDetails({ placeId: prediction.place_id }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const addressComponents = place.address_components;
          if (field === 'street') {
            // Auto-populate all fields when the user selects a full address in the street field.
            const streetValue = prediction.description.split(',')[0];
            const cityValue = getComponent(addressComponents, ['locality']) || getComponent(addressComponents, ['administrative_area_level_2']);
            const stateValue = getComponent(addressComponents, ['administrative_area_level_1']);
            const zipValue = getComponent(addressComponents, ['postal_code']);
            const countryValue = getComponent(addressComponents, ['country']);
            setFormData(prev => ({
              ...prev,
              street: streetValue,
              city: cityValue,
              state: stateValue,
              zip: zipValue,
              country: countryValue,
            }));
            // Also update local input states.
            setStreetInput(streetValue);
            setCityInput(cityValue);
            setStateInput(stateValue);
            setZipInput(zipValue);
            setCountryInput(countryValue);
          } else {
            // For other fields, update only that field.
            let value = prediction.description;
            switch (field) {
              case 'city':
                value = getComponent(addressComponents, ['locality']) || getComponent(addressComponents, ['administrative_area_level_2']);
                break;
              case 'state':
                value = getComponent(addressComponents, ['administrative_area_level_1']);
                break;
              case 'zip':
                value = getComponent(addressComponents, ['postal_code']);
                break;
              case 'country':
                value = getComponent(addressComponents, ['country']);
                break;
              default:
                break;
            }
            setFormData(prev => ({
              ...prev,
              [field]: value
            }));
            updateInput(value);
          }
        }
      });
    }
  };

  // Generic autocomplete change handler.
  // We add extra post-processing for non-street fields to filter out predictions that begin with numbers.
  const handleGenericChange = (field, value, typesFilter, setInput, setPredictions) => {
    // Update local state and formData.
    setInput(value);
    setFormData(prev => ({ ...prev, [field]: value }));

    // For zip and country, enforce basic restrictions.
    if (field === 'zip' && !/^\d*$/.test(value)) return;
    if (field === 'country' && !/^[A-Za-z\s]*$/.test(value)) return;

    if (!isMapsLoaded || value.length < 3) {
      setPredictions([]);
      return;
    }

    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input: value, types: typesFilter },
        (preds, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
            // For fields other than street, filter out predictions that start with numbers.
            const processedPreds = field === 'street'
              ? preds
              : preds.filter(prediction => !/^\d/.test(prediction.description));
            setPredictions(processedPreds);
          } else {
            setPredictions([]);
          }
        }
      );
    }
  };

  // Specific onChange handlers for each field.
  const handleStreetChange = (e) => {
    handleGenericChange('street', e.target.value, ['address'], setStreetInput, setStreetPredictions);
  };

  const handleCityChange = (e) => {
    handleGenericChange('city', e.target.value, ['(cities)'], setCityInput, setCityPredictions);
  };

  const handleStateChange = (e) => {
    handleGenericChange('state', e.target.value, ['(regions)'], setStateInput, setStatePredictions);
  };

  const handleZipChange = (e) => {
    const newValue = e.target.value;
    if (!/^\d*$/.test(newValue)) return;
    handleGenericChange('zip', newValue, ['(regions)'], setZipInput, setZipPredictions);
  };

  const handleCountryChange = (e) => {
    const newValue = e.target.value;
    if (!/^[A-Za-z\s]*$/.test(newValue)) return;
    handleGenericChange('country', newValue, ['(regions)'], setCountryInput, setCountryPredictions);
  };

  return (
    <div className="form-container">
      <header className="header revamped-header">
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
          <h1 className="revamped-hero-heading">
            Get Your Business Listed Today
          </h1>
          <p className="revamped-hero-subheading">
            Join thousands of local businesses on ExploreLocal!
          </p>
        </div>
        <div className="revamped-progress-indicator">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const adjustedStep = isSignedIn && stepNumber >= 7 ? stepNumber + 1 : stepNumber;
            return (
              <div key={i} className="revamped-step-wrapper">
                <div
                  className={`revamped-step ${step === adjustedStep ? 'active' : ''} ${
                    step > adjustedStep ? 'completed' : ''
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
        <div className="grey-container revamped-grey-container">
          <div className="form-step">
            <h1>Where is Your Business Located?</h1>
            <p>
              Provide your full address so customers can easily locate you. Include street, city, state, and postal code.
            </p>

            <div className="innerLocation">
              <div className="street" style={{ position: 'relative' }}>
                <label htmlFor="street" className="input-label">Street Address</label>
                <input
                  ref={streetInputRef}
                  id="street"
                  type="text"
                  name="street"
                  placeholder="123 Main St"
                  value={streetInput}
                  onChange={handleStreetChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="street-error"
                  className="revamped-input"
                />
                {errors.street && (
                  <span id="street-error" className="error">{errors.street}</span>
                )}
                {streetPredictions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {streetPredictions.map(prediction => (
                      <li
                        key={prediction.place_id}
                        onMouseDown={() => handleFieldPredictionClick('street', prediction)}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="apt">
                <label htmlFor="apt" className="input-label">Apt/Suite/Other</label>
                <input
                  id="apt"
                  type="text"
                  name="apt"
                  placeholder="Apt 101"
                  value={formData.apt}
                  onChange={handleInputChange}
                  className="revamped-input"
                />
              </div>
            </div>

            <div className="outerLocation">
              <div className="city" style={{ position: 'relative' }}>
                <label htmlFor="city" className="input-label">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="New York"
                  value={cityInput}
                  onChange={handleCityChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="city-error"
                  className="revamped-input"
                />
                {errors.city && <span id="city-error" className="error">{errors.city}</span>}
                {cityPredictions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {cityPredictions.map(prediction => (
                      <li
                        key={prediction.place_id}
                        onMouseDown={() => handleFieldPredictionClick('city', prediction)}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="state" style={{ position: 'relative' }}>
                <label htmlFor="state" className="input-label">State</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  placeholder="NY"
                  value={stateInput}
                  onChange={handleStateChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="state-error"
                  className="revamped-input"
                />
                {errors.state && (
                  <span id="state-error" className="error">{errors.state}</span>
                )}
                {statePredictions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {statePredictions.map(prediction => (
                      <li
                        key={prediction.place_id}
                        onMouseDown={() => handleFieldPredictionClick('state', prediction)}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="zip" style={{ position: 'relative' }}>
                <label htmlFor="zip" className="input-label">Zip Code</label>
                <input
                  id="zip"
                  type="text"
                  name="zip"
                  placeholder="10001"
                  value={zipInput}
                  onChange={handleZipChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="zip-error"
                  className="revamped-input"
                />
                {errors.zip && <span id="zip-error" className="error">{errors.zip}</span>}
                {zipPredictions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {zipPredictions.map(prediction => (
                      <li
                        key={prediction.place_id}
                        onMouseDown={() => handleFieldPredictionClick('zip', prediction)}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="country" style={{ position: 'relative' }}>
                <label htmlFor="country" className="input-label">Country</label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="United States"
                  value={countryInput}
                  onChange={handleCountryChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="country-error"
                  className="revamped-input"
                />
                {errors.country && (
                  <span id="country-error" className="error">{errors.country}</span>
                )}
                {countryPredictions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {countryPredictions.map(prediction => (
                      <li
                        key={prediction.place_id}
                        onMouseDown={() => handleFieldPredictionClick('country', prediction)}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button className="continue-button revamped-continue-button" onClick={nextStep}>
              Continue
            </button>
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
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
        <div className="revamped-copyright">© ExploreLocal 2025 All Rights Reserved.</div>
      </footer>
    </div>
  );
}