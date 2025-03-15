import React, { useState, useEffect, useRef } from 'react';
import { useBusinessForm } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessAddress() {
  const {
    step,
    formData,
    handleInputChange,
    handleBlur,
    errors,
    nextStep,
    prevStep,
    setFormData
  } = useBusinessForm();

  // Local states for Google Maps, inputs and predictions for each field.
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  // Street state and predictions
  const [streetInput, setStreetInput] = useState(formData.street || "");
  const [streetPredictions, setStreetPredictions] = useState([]);

  // City state and predictions
  const [cityInput, setCityInput] = useState(formData.city || "");
  const [cityPredictions, setCityPredictions] = useState([]);

  // State (region) state and predictions
  const [stateInput, setStateInput] = useState(formData.state || "");
  const [statePredictions, setStatePredictions] = useState([]);

  // Zip state and predictions
  const [zipInput, setZipInput] = useState(formData.zip || "");
  const [zipPredictions, setZipPredictions] = useState([]);

  // Country state and predictions
  const [countryInput, setCountryInput] = useState(formData.country || "");
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
            <h1>Where is your business located?</h1>
            <p>Enter the address where customers can find you, or provide your official registered address.</p>

            <div className="innerLocation">
              <div className="street" style={{ position: 'relative' }}>
                <input
                  ref={streetInputRef}
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={streetInput}
                  onChange={handleStreetChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="street-error"
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
              <div className="city" style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={cityInput}
                  onChange={handleCityChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="city-error"
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
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={stateInput}
                  onChange={handleStateChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="state-error"
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
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={zipInput}
                  onChange={handleZipChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="zip-error"
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
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={countryInput}
                  onChange={handleCountryChange}
                  onBlur={handleBlur}
                  required
                  aria-describedby="country-error"
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
