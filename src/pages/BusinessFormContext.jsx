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
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { uploadData, getUrl, remove } from '@aws-amplify/storage';
import axios from 'axios';
import { element } from 'prop-types';
import { Login } from '../LoginFunctions';

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
    4: [], // Keeping this empty since the website is technically optional (can be skipped)
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

  async function uploadPhotosToS3(files) {
    const uploadedUrls = [];
    try {
      for (const file of files) {
        const fileName = `business-photos/${Date.now()}-${file.name}`;
        const uploadTask = await uploadData({
          path: fileName,
          data: file,
          options: { contentType: file.type },
        }).result;
        // const urlResult = await getUrl({ path: fileName });
        // uploadedUrls.push(urlResult.url.toString().split('?')[0]);
        uploadedUrls.push(fileName);
      }
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading photos to S3:', error);
      throw error;
    }
  }

  async function removePhotoFromS3(url) {
    try {
      const key = url.split('.com/')[1];
      await remove({ path: key });
    } catch (error) {
      console.error('Error removing photo from S3:', error);
      throw error;
    }
  }

  async function handleInputChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photos' && files.length > 0) {
      try {
        const urls = await uploadPhotosToS3(Array.from(files));
        setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...urls] }));
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          photos: 'Failed to upload photos. Please try again.',
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  }

  async function handleRemovePhoto(index) {
    const urlToRemove = formData.photos[index];
    try {
      await removePhotoFromS3(urlToRemove);
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photos: 'Failed to remove photo. Please try again.',
      }));
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
    
    // Special validation for step 4 (Business Website)
    if (stepNumber === 4) {
      // If the website field is empty, trigger an error
      if (!data.website.trim()) {
        stepErrors.website = 'Please enter a website URL or click "I don\'t have a website" to skip.';
      }
      // If the website field has a value, validate the URL format
      else if (data.website.trim() && !urlRegex.test(data.website)) {
        stepErrors.website = 'Please enter a valid website URL (e.g., https://example.com)';
      }
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

  async function createBusinessHours(businessId) {
    try {
      for (const hours of formData.businessHours) {
        const hoursData = {
          businessId,
          day: hours.day,
          openTime: hours.openTime || '',
          closeTime: hours.closeTime || '',
          isOpen24: hours.isOpen24,
          isClosed: hours.isClosed,
        };
        const response = await client.models.BusinessHours.create(hoursData);
        if (response.errors) {
          throw new Error(response.errors[0].message);
        }
      }
    } catch (error) {
      console.error('Error creating business hours:', error);
      throw error;
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
        console.log('Attempting sign-up with:', {
          email: formData.emailaddress,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        const signUpResult = await signUp({
          username: formData.emailaddress,
          password: formData.password,
          options: {
            userAttributes: {
              given_name: formData.firstName,
              family_name: formData.lastName,
            },
          },
        });
        console.log('Sign-up successful:', signUpResult);
        setStep(7.5);
        navigate('/add-business/business-account/verify');
      } catch (error) {
        console.error('Sign-up failed:', error);
        let errorMessage = 'Failed to create account. Please try again.';
        if (error.name === 'UsernameExistsException') {
          errorMessage = 'An account with this email already exists.';
        } else if (error.name === 'InvalidParameterException') {
          errorMessage = 'Invalid input provided. Please check your details.';
        }
        setErrors({ manualSignUp: errorMessage });
      }
      return;
    }

    if (step === 7.5 && !isSignedIn) {
      try {
        console.log('Attempting to confirm sign-up with code:', verificationCode);
        const confirmResult = await confirmSignUp({
          username: formData.emailaddress,
          confirmationCode: verificationCode,
        });
        console.log('Confirm sign-up successful:', confirmResult);

        console.log('Attempting sign-in with:', {
          username: formData.emailaddress,
        });
        const signInResult = await signIn({
          username: formData.emailaddress,
          password: formData.password,
        });
        console.log('Sign-in successful:', signInResult);

        setIsSignedIn(true);
        setStep(8);
        navigate('/add-business/business-hours');
      } catch (error) {
        console.error('Verification or sign-in failed:', error);
        let errorMessage = 'Invalid code or sign-in failed. Please try again.';
        if (error.name === 'CodeMismatchException') {
          errorMessage = 'Invalid verification code. Please check and try again.';
        } else if (error.name === 'NotAuthorizedException') {
          errorMessage = 'Incorrect email or password.';
        }
        setErrors({ verification: errorMessage });
      }
      return;
    }

    if (step === 10) {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        if (!formData.description || formData.description.trim() === '') {
          setErrors({ description: 'Business description is required.' });
          return;
        }

        const address = {
          streetAddress: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zip,
          country: formData.country,
        };
        const location = await geocodeAddress(address);

        const userData = {
          id: attributes.sub,
          name: {
            firstName: attributes.given_name || formData.firstName,
            lastName: attributes.family_name || formData.lastName,
          },
          email: attributes.email || formData.emailaddress,
          joinedAt: Date.now(),
          lastLogin: Date.now(),
        };
        const userResponse = await client.models.User.create(userData, {
          condition: { id: { ne: attributes.sub } },
        });

        const businessData = {
          businessOwnerId: attributes.sub,
          name: formData.businessName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          website: formData.website || null,
          category: formData.categories,
          streetAddress: formData.street,
          aptSuiteOther: formData.apt || '',
          city: formData.city,
          state: formData.state,
          zipcode: formData.zip,
          country: formData.country,
          location: location || { lattitude: 0, longitude: 0 },
          description: formData.description,
          photos: formData.photos,
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
      // await signInWithRedirect({
      //   provider: 'Google',
      //   customState: JSON.stringify({ redirectTo: '/add-business/business-hours' }),
      // });
      Login('/add-business/business-hours');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ google: 'Failed to sign in with Google. Please try again.' });
    }
  }

  async function resendVerificationCode() {
    try {
      console.log('Resending verification code to:', formData.emailaddress);
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

  // Function to navigate to a specific step
  function navigateToStep(stepNumber) {
    // Prevent navigation to skipped steps (7 or 7.5) for signed-in users
    if (isSignedIn && (stepNumber === 7 || stepNumber === 7.5)) {
      // If coming from a later step, go to step 6
      if (step > 7.5) {
        stepNumber = 6;
      }
      // If coming from an earlier step, go to step 8
      else if (step < 7) {
        stepNumber = 8;
      }
    }
  
    if (stepNumber <= step && stepToRouteMap[stepNumber]) {
      setStep(stepNumber);
      navigate(stepToRouteMap[stepNumber]);
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

              // Handle customState redirect
              const customState = data.payload.data?.customState
                ? JSON.parse(data.payload.data.customState)
                : { redirectTo: '/add-business/business-hours' }; // Default for this pipeline
              const redirectTo = customState.redirectTo || '/add-business/business-hours';
              console.log('User signed in, redirecting to:', redirectTo);
              navigate(redirectTo);
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
  }, [navigate]);

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
    handleRemovePhoto,
    handleBlur,
    handleHoursChange,
    skipWebsite,
    signInWithGoogle,
    nextStep,
    prevStep,
    isStepComplete,
    resendVerificationCode,
    navigate,
    stepToRouteMap, // Add stepToRouteMap to context
    navigateToStep, // Add navigateToStep function to context
  };

  return (
    <BusinessFormContext.Provider value={value}>
      {children}
    </BusinessFormContext.Provider>
  );
}