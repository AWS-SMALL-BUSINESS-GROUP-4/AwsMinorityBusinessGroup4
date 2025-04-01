// BusinessFormContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hub } from '@aws-amplify/core';
import {
  signInWithRedirect,
  fetchUserAttributes,
  signUp,
  signIn,
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode,
} from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import axios from 'axios';
import { element } from 'prop-types';

const client = generateClient();

export const stepToRouteMap = {
  1: '/add-business/business-name',
  2: '/add-business/business-email',
  3: '/add-business/business-phone',
  4: '/add-business/business-website',
  5: '/add-business/business-categories',
  6: '/add-business/business-address',
  7: '/add-business/business-account',
  7.5: '/add-business/business-account/verify',
  8: '/add-business/business-hours',
  9: '/add-business/business-description',
  10: '/add-business/business-photos',
};

const routeToStepMap = {
  '/add-business/business-name': 1,
  '/add-business/business-email': 2,
  '/add-business/business-phone': 3,
  '/add-business/business-website': 4,
  '/add-business/business-categories': 5,
  '/add-business/business-address': 6,
  '/add-business/business-account': 7,
  '/add-business/business-account/verify': 7.5,
  '/add-business/business-hours': 8,
  '/add-business/business-description': 9,
  '/add-business/business-photos': 10,
};

const BusinessFormContext = createContext();

export function useBusinessForm() {
  return useContext(BusinessFormContext);
}

export function BusinessFormProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('businessFormStep');
    return savedStep ? parseFloat(savedStep) : 1;
  });
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('businessFormData');
    return savedData ? JSON.parse(savedData) : {
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
    };
  });

  const [businessOwnerId, setBusinessOwnerId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?]).{8,}$/;
  const phoneRegex = /^\d{10}$/;
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const requiredFields = {
    1: ['businessName'],
    2: ['email'],
    3: ['phoneNumber'],
    4: [],
    5: ['categories'],
    6: ['street', 'city', 'state', 'zip', 'country'],
    7: ['firstName', 'lastName', 'emailaddress', 'password'],
    7.5: [],
    8: [],
    9: [],
    10: [],
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

  const toTitleCase = (str) =>
    str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

  function validateField(field, value) {
    if (requiredFields[step]?.includes(field) && !value.trim()) {
      return `${fieldDisplayNames[field] || toTitleCase(field)} is required`;
    }
    if ((field === 'email' || field === 'emailaddress') && value && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    if (field === 'password' && value && !passwordRegex.test(value)) {
      return 'Password must be at least 8 characters long and include letters, numbers, and symbols';
    }
    if (field === 'phoneNumber' && value && !phoneRegex.test(value)) {
      return 'Please enter a valid 10-digit phone number';
    }
    if (field === 'website' && value.trim() && !urlRegex.test(value)) {
      return 'Please enter a valid website URL (e.g., https://example.com)';
    }
    return '';
  }

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photos') {
      setFormData((prev) => ({ ...prev, photos: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }

  function handleHoursChange(index, field, value) {
    setFormData((prev) => {
      const updated = [...prev.businessHours];
      if (field === 'isOpen24') {
        updated[index].isOpen24 = value;
        if (value) {
          updated[index].openTime = '00:00';
          updated[index].closeTime = '00:00';
          updated[index].isClosed = false;
        } else {
          updated[index].openTime = '';
          updated[index].closeTime = '';
        }
      } else if (field === 'isClosed') {
        updated[index].isClosed = value;
        if (value) {
          updated[index].isOpen24 = false;
          updated[index].openTime = '';
          updated[index].closeTime = '';
        }
      } else {
        updated[index][field] = value;
      }
      return { ...prev, businessHours: updated };
    });
  }

  function validateStep(stepNumber, data) {
    const stepErrors = {};
    const fields = requiredFields[stepNumber] || [];
    fields.forEach((field) => {
      const err = validateField(field, data[field]);
      if (err) stepErrors[field] = err;
    });
    if (stepNumber === 4 && data.website.trim() && !urlRegex.test(data.website)) {
      stepErrors.website = 'Please enter a valid website URL (e.g., https://example.com)';
    }
    return stepErrors;
  }

  function isStepComplete(stepNumber) {
    if (stepNumber === 8) {
      return formData.businessHours.every((day) => {
        if (day.isOpen24 || day.isClosed) return true;
        return day.openTime && day.closeTime;
      });
    }
    if (stepNumber === 9) {
      return formData.description.trim() !== '';
    }
    if (stepNumber === 10) {
      return true; // Photos are optional
    }
    return true;
  }

  // Geocoding function using Google Maps API
  async function geocodeAddress(address) {
    const apiKey = import.meta.env.VITE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('Google Places API key is missing');
      return null;
    }

    const fullAddress = `${address.streetAddress}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
      );
      const { results, status } = response.data;
      if (status === 'OK' && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return { lattitude: lat, longitude: lng };
      } else {
        console.error('Geocoding failed:', status);
        return null;
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      return null;
    }
  }

  async function nextStep() {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    if (step === 7 && !isSignedIn) {
      try {
        const signUpResult = await signUp({
          username: formData.emailaddress,
          password: formData.password,
          attributes: {
            'given_name': formData.firstName,
            'family_name': formData.lastName,
          },
        });
        setStep(7.5);
        navigate('/add-business/business-account/verify');
      } catch (error) {
        console.error('Sign-up failed:', error);
        setErrors({
          manualSignUp: error.message || 'Failed to create account. Please try again.',
        });
      }
      return;
    }
    if (step === 7.5 && !isSignedIn) {
      try {
        await confirmSignUp({
          username: formData.emailaddress,
          confirmationCode: verificationCode,
        });
        await signIn({
          username: formData.emailaddress,
          password: formData.password,
        });
        setIsSignedIn(true);
        setStep(8);
        navigate('/add-business/business-hours');
      } catch (error) {
        console.error('Verification or sign-in failed:', error);
        setErrors({ verification: error.message || 'Invalid code. Please try again.' });
      }
      return;
    }
    if (step === 10) {
      try {
        const user = await getCurrentUser();
        console.log('Authenticated user:', user);
        const attributes = await fetchUserAttributes();
        console.log('User attributes:', attributes);

        // Ensure description is provided
        if (!formData.description || formData.description.trim() === '') {
          setErrors({ description: 'Business description is required.' });
          return;
        }

        // Geocode the address
        const address = {
          streetAddress: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zip,
          country: formData.country,
        };
        const location = await geocodeAddress(address);

        // Create or update User record
        const userData = {
          id: attributes.sub, // Use sub as the identifier
          name: {
            firstName: attributes.given_name || formData.firstName,
            lastName: attributes.family_name || formData.lastName,
          },
          email: attributes.email || formData.emailaddress,
          joinedAt: Date.now(),
          lastLogin: Date.now(),
        };
        const userResponse = await client.models.User.create(userData, {
          condition: { id: { ne: attributes.sub } }, // Create only if it doesn’t exist
        });
        console.log('User creation response:', userResponse);

        const businessData = {
          businessOwnerId: attributes.sub, // Links to User.id
          // businessOwner is handled by the relationship, not set here
          name: formData.businessName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          website: formData.website || null,
          category: formData.categories, // Assuming singular; adjust if array
          streetAddress: formData.street,
          aptSuiteOther: formData.apt || '',
          city: formData.city,
          state: formData.state,
          zipcode: formData.zip,
          country: formData.country,
          location: location || { lattitude: 0, longitude: 0 }, // Fallback if geocoding fails
          businessHours: JSON.stringify(formData.businessHours),
          description: formData.description,
          photos: [], // Placeholder for S3 URLs
        };

        console.log('Attempting to create business with data:', businessData);
        const response = await client.models.Business.create(businessData);
        console.log('Create response:', response);

        var hoursResponses = [];

        formData.businessHours.forEach(async hours => {
          const hour_response = await client.models.BusinessHours.create({businessId: response.data.id, ...hours});
          hoursResponses.push(hour_response);
          console.log(`Returned hour_response: `, hour_response);
        });

        if (response.errors) {
          throw new Error(response.errors[0].message);
        }

        hoursResponses.forEach(element => {
          if(element.errors) {
            throw new Error(element.errors[9].messagee);
          }
        });

        console.log('Business created successfully:', response.data);

        localStorage.removeItem('businessFormStep');
        localStorage.removeItem('businessFormData');
        navigate(`/business-profile/${response.data.id}`);
      } catch (error) {
        console.error('Error in nextStep:', error);
        setErrors({ submit: `Failed to save business data: ${error.message}` });
      }
      return;
    }
    if (step < 10) {
      if (isSignedIn && step === 6) {
        setStep(8);
        navigate('/add-business/business-hours');
      } else {
        const newStep = step + 1;
        setStep(newStep);
        navigate(stepToRouteMap[newStep]);
      }
    }
  }

  function prevStep() {
    if (step === 7.5) {
      setStep(7);
      navigate('/add-business/business-account');
      return;
    }
    if (isSignedIn && step === 8) {
      setStep(6);
      navigate('/add-business/business-address');
      return;
    }
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      navigate(stepToRouteMap[newStep]);
    }
  }

  function skipWebsite() {
    setErrors({});
    const newStep = step + 1;
    setStep(newStep);
    navigate(stepToRouteMap[newStep]);
  }

  async function signInWithGoogle() {
    try {
      localStorage.setItem('businessFormStep', '8');
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ google: 'Failed to sign in with Google. Please try again.' });
    }
  }

  async function resendVerificationCode() {
    try {
      await resendSignUpCode({ username: formData.emailaddress });
      setErrors((prev) => ({ ...prev, verification: 'Code resent. Check your email.' }));
    } catch (error) {
      console.error('Error resending verification code:', error);
      setErrors((prev) => ({
        ...prev,
        verification: error.message || 'Failed to resend code. Please try again.',
      }));
    }
  }

  useEffect(() => {
    const pathNoSlash = location.pathname.replace(/\/$/, '');
    const storedStep = localStorage.getItem('businessFormStep');
    const storedData = localStorage.getItem('businessFormData');

    if (routeToStepMap[pathNoSlash]) {
      const currentStep = routeToStepMap[pathNoSlash];
      setStep(currentStep);
    } else if (storedStep && storedData) {
      const parsedStep = parseFloat(storedStep);
      setStep(parsedStep);
      const route = stepToRouteMap[parsedStep];
      if (route && location.pathname !== route) {
        navigate(route, { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    localStorage.setItem('businessFormStep', step.toString());
    localStorage.setItem('businessFormData', JSON.stringify(formData));
  }, [step, formData]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setIsSignedIn(true);
        setBusinessOwnerId(attributes.sub);
        setFormData((prev) => ({
          ...prev,
          firstName: attributes.given_name || '',
          lastName: attributes.family_name || '',
          emailaddress: attributes.email || '',
        }));
      } catch (error) {
        console.log('No authenticated user found:', error);
        setIsSignedIn(false);
      }
    };
    checkUser();

    const listener = (data) => {
      switch (data.payload.event) {
        case 'signIn':
          fetchUserAttributes()
            .then((attributes) => {
              setFormData((prev) => ({
                ...prev,
                firstName: attributes.given_name || '',
                lastName: attributes.family_name || '',
                emailaddress: attributes.email || '',
                password: '',
              }));
              setBusinessOwnerId(attributes.sub);
              setIsSignedIn(true);
            })
            .catch((error) => {
              console.error('Error fetching attributes:', error);
              setErrors({ google: 'Authentication failed. Please try again.' });
            });
          break;
        case 'signIn_failure':
          console.error('Sign-in failure:', data.payload.data);
          setErrors({ google: 'Google sign-in failed. Please try again.' });
          break;
        default:
          break;
      }
    };

    const unsub = Hub.listen('auth', listener);
    return () => unsub();
  }, []);

  const value = {
    step,
    setStep,
    formData,
    setFormData,
    isSignedIn,
    setIsSignedIn,
    businessOwnerId,
    setBusinessOwnerId,
    verificationCode,
    setVerificationCode,
    errors,
    setErrors,
    handleInputChange,
    handleBlur,
    handleHoursChange,
    skipWebsite,
    signInWithGoogle,
    nextStep,
    prevStep,
    isStepComplete,
    resendVerificationCode,
  };

  return (
    <BusinessFormContext.Provider value={value}>
      {children}
    </BusinessFormContext.Provider>
  );
}