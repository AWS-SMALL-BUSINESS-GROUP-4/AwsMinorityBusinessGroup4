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
} from 'aws-amplify/auth';

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

  useEffect(() => {
    if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
      const trimmedPath = location.pathname.slice(0, -1);
      const search = location.search || '';
      const hash = location.hash || '';
      navigate(trimmedPath + search + hash, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

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
    if ((field === 'email' || field === 'emailaddress') && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    if (field === 'password' && !passwordRegex.test(value)) {
      return 'Password must be at least 8 characters long and include letters, numbers, and symbols';
    }
    if (field === 'phoneNumber' && !phoneRegex.test(value)) {
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
      return formData.photos.length > 0;
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
    if (step === 4) {
      if (!formData.website.trim()) {
        setErrors({ website: 'Website is required to continue' });
        return;
      }
      if (!urlRegex.test(formData.website)) {
        setErrors({ website: 'Please enter a valid website URL (e.g., https://example.com)' });
        return;
      }
    }
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    // Replace the signUp function call in your nextStep function (around line 245)
    if (step === 7 && !isSignedIn) {
        try {
        const signUpResult = await signUp({
            username: formData.emailaddress,
            password: formData.password,
            attributes: {
            // Change these attribute names to match what Cognito expects
            givenName: formData.firstName,  // Changed from given_name
            familyName: formData.lastName,  // Changed from family_name
            email: formData.emailaddress,
            },
        });
        setBusinessOwnerId(signUpResult.userSub);
        setStep(7.5);
        navigate('/my-businesses/business-account/verify');
        return;
        } catch (error) {
        setErrors({
            manualSignUp: error.message || 'Failed to create account. Please try again.',
        });
        console.error('Sign-up error:', error);
        return;
        }
    }
    if (step === 7.5) {
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
        navigate('/my-businesses/business-hours');
        return;
      } catch (error) {
        setErrors({ verification: error.message || 'Invalid code. Please try again.' });
        return;
      }
    }
    if (step < 10) {
      if (isSignedIn && step === 6) {
        setStep(8);
        navigate('/my-businesses/business-hours');
        return;
      } else {
        const newStep = step + 1;
        setStep(newStep);
        const route = stepToRouteMap[newStep];
        if (route) navigate(route);
        return;
      }
    }
    if (step === 10) {
      navigate('/business-profile', { state: { formData, businessOwnerId } });
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
      const route = stepToRouteMap[newStep];
      if (route) navigate(route);
    }
  }

  function skipWebsite() {
    setErrors({});
    const newStep = step + 1;
    setStep(newStep);
    const route = stepToRouteMap[newStep];
    if (route) navigate(route);
  }

  async function signInWithGoogle() {
    try {
      localStorage.setItem('businessFormStep', '8');
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      setErrors({ google: 'Failed to sign in with Google. Please try again.' });
    }
  }

  useEffect(() => {
    const pathNoSlash = location.pathname.replace(/\/$/, '');
    if (routeToStepMap[pathNoSlash]) {
      setStep(routeToStepMap[pathNoSlash]);
    } else {
      const storedStep = localStorage.getItem('businessFormStep');
      if (storedStep) {
        const route = stepToRouteMap[parseFloat(storedStep)];
        if (route) navigate(route, { replace: true });
      }
    }
    const storedData = localStorage.getItem('businessFormData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setFormData(parsed);
      } catch (err) {
        console.error('Error parsing local form data:', err);
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
        await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setIsSignedIn(true);
        setBusinessOwnerId(attributes.sub);
        // In your useEffect where you fetch user attributes
        setFormData((prev) => ({
            ...prev,
            firstName: attributes.givenName || '',  // Changed from given_name
            lastName: attributes.familyName || '',  // Changed from family_name
            emailaddress: attributes.email || '',
        }));
      } catch {
        setIsSignedIn(false);
      }
    };
    checkUser();

        // In your Hub listener
    const listener = (data) => {
        switch (data.payload.event) {
        case 'signIn':
            fetchUserAttributes()
            .then((attributes) => {
                setFormData((prev) => ({
                ...prev,
                firstName: attributes.givenName || '',  // Changed from given_name
                lastName: attributes.familyName || '',  // Changed from family_name
                emailaddress: attributes.email || '',
                password: '',
                }));
                setBusinessOwnerId(attributes.sub);
            })
            .catch(() => {
                setErrors({ google: 'Authentication failed. Please try again.' });
            });
            break;
        case 'signIn_failure':
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
  };

  return (
    <BusinessFormContext.Provider value={value}>
      {children}
    </BusinessFormContext.Provider>
  );
}