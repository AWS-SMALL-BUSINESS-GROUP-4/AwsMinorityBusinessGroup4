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
import axios from 'axios';

export const stepToRouteMap = {
  1: '/my-businesses/business-name',
  2: '/my-businesses/business-email',
  3: '/my-businesses/business-phone',
  4: '/my-businesses/business-website',
  5: '/my-businesses/business-categories',
  6: '/my-businesses/business-address',
  7: '/my-businesses/business-account',
  7.5: '/my-businesses/business-account/verify',
  8: '/my-businesses/business-hours',
  9: '/my-businesses/business-description',
  10: '/my-businesses/business-photos',
};

const routeToStepMap = {
  '/my-businesses/business-name': 1,
  '/my-businesses/business-email': 2,
  '/my-businesses/business-phone': 3,
  '/my-businesses/business-website': 4,
  '/my-businesses/business-categories': 5,
  '/my-businesses/business-address': 6,
  '/my-businesses/business-account': 7,
  '/my-businesses/business-account/verify': 7.5,
  '/my-businesses/business-hours': 8,
  '/my-businesses/business-description': 9,
  '/my-businesses/business-photos': 10,
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
    console.log(`Updating ${name} to ${value || files}`);
    if (name === 'photos') {
      setFormData((prev) => ({ ...prev, photos: Array.from(files) }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        console.log('Updated formData:', updated);
        return updated;
      });
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
    console.log(`Updating businessHours[${index}].${field} to ${value}`);
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

  async function nextStep() {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (step === 7 && !isSignedIn) {
      try {
        console.log('Attempting sign-up with:', {
          username: formData.emailaddress,
          password: formData.password,
          attributes: {
            'name.givenName': formData.firstName,
            'name.familyName': formData.lastName,
          },
        });
        const signUpResult = await signUp({
          username: formData.emailaddress,
          password: formData.password,
          attributes: {
            'name.givenName': formData.firstName, // Adjusted to match schema
            'name.familyName': formData.lastName, // Adjusted to match schema
          },
        });
        console.log('Sign-up result:', signUpResult);
        setStep(7.5);
        navigate('/my-businesses/business-account/verify');
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
        console.log('Attempting to confirm sign-up with:', {
          username: formData.emailaddress,
          code: verificationCode,
        });
        await confirmSignUp({
          username: formData.emailaddress,
          confirmationCode: verificationCode,
        });
        console.log('Sign-up confirmed, attempting sign-in');
        await signIn({
          username: formData.emailaddress,
          password: formData.password,
        });
        console.log('Sign-in successful');
        setIsSignedIn(true);
        setStep(8);
        navigate('/my-businesses/business-hours');
      } catch (error) {
        console.error('Verification or sign-in failed:', error);
        setErrors({ verification: error.message || 'Invalid code. Please try again.' });
      }
      return;
    }
    if (step === 10) {
      try {
        console.log('Navigating to /business-profile with formData:', formData);
        navigate('/business-profile', { state: { formData } });
      } catch (error) {
        console.error('Error during submission:', error);
        setErrors({ submit: 'Failed to submit. Please try again.' });
      }
      return;
    }
    if (step < 10) {
      if (isSignedIn && step === 6) {
        setStep(8);
        navigate('/my-businesses/business-hours');
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
      navigate('/my-businesses/business-account');
      return;
    }
    if (isSignedIn && step === 8) {
      setStep(6);
      navigate('/my-businesses/business-address');
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
      console.log('Initiating Google sign-in redirect');
      localStorage.setItem('businessFormStep', '8');
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ google: 'Failed to sign in with Google. Please try again.' });
    }
  }

  async function resendVerificationCode() {
    try {
      console.log('Attempting to resend verification code for:', formData.emailaddress);
      const resendResult = await resendSignUpCode({ username: formData.emailaddress });
      console.log('Resend result:', resendResult);
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
    console.log('Saving to localStorage:', { step, formData });
    localStorage.setItem('businessFormStep', step.toString());
    localStorage.setItem('businessFormData', JSON.stringify(formData));
  }, [step, formData]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        console.log('User authenticated:', user, attributes);
        setIsSignedIn(true);
        setBusinessOwnerId(attributes.sub);
        setFormData((prev) => ({
          ...prev,
          firstName: attributes['name.givenName'] || '', // Adjust for schema
          lastName: attributes['name.familyName'] || '', // Adjust for schema
          emailaddress: attributes.email || '',
        }));
      } catch (error) {
        console.log('No authenticated user found:', error);
        setIsSignedIn(false);
      }
    };
    checkUser();

    const listener = (data) => {
      console.log('Auth event:', data.payload.event);
      switch (data.payload.event) {
        case 'signIn':
          fetchUserAttributes()
            .then((attributes) => {
              setFormData((prev) => ({
                ...prev,
                firstName: attributes['name.givenName'] || '',
                lastName: attributes['name.familyName'] || '',
                emailaddress: attributes.email || '',
                password: '',
              }));
              setBusinessOwnerId(attributes.sub);
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