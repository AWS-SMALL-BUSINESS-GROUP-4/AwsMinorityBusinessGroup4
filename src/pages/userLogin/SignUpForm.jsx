import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn, resendSignUpCode } from 'aws-amplify/auth';
import Input from './Input';
import PasswordInput from './PasswordInput';
import { FaUser, FaEnvelope } from 'react-icons/fa';

function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?]).{8,}$/;

  const validateField = (name, value) => {
    if (name === 'firstName' && !value.trim()) return 'First Name is required';
    if (name === 'lastName' && !value.trim()) return 'Last Name is required';
    if (name === 'email' && !value.trim()) return 'Email Address is required';
    if (name === 'email' && value && !emailRegex.test(value)) return 'Please enter a valid email address';
    if (name === 'password' && !value) return 'Password is required';
    if (name === 'password' && value && !passwordRegex.test(value))
      return 'Password must be at least 8 characters long and include letters, numbers, and symbols';
    if (name === 'confirmPassword' && value !== formData.password) return 'Passwords do not match';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.firstName = validateField('firstName', formData.firstName);
    newErrors.lastName = validateField('lastName', formData.lastName);
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    return Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.error('Sign-up validation errors:', validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting manual sign-up with:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      const signUpResult = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            given_name: formData.firstName,
            family_name: formData.lastName,
          },
        },
      });
      console.log('Manual sign-up successful:', signUpResult);
      setIsVerifying(true);
    } catch (error) {
      console.error('Manual sign-up error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      switch (error.name) {
        case 'UsernameExistsException':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'InvalidParameterException':
          errorMessage = 'Invalid input provided. Please check your details.';
          break;
        case 'InvalidPasswordException':
          errorMessage = 'Password does not meet requirements.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setErrors({ manualSignUp: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!verificationCode.trim()) {
      const errorMessage = 'Verification code is required';
      setErrors({ verification: errorMessage });
      console.error('Verification error:', errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting to confirm sign-up with code:', verificationCode);
      const confirmResult = await confirmSignUp({
        username: formData.email,
        confirmationCode: verificationCode,
      });
      console.log('Confirm sign-up successful:', confirmResult);

      console.log('Attempting sign-in after verification with:', { email: formData.email });
      await signIn({
        username: formData.email,
        password: formData.password,
      });
      console.log('Sign-in initiated successfully');
      // Hub listener in UserLogin.jsx handles redirect and user record creation
    } catch (error) {
      console.error('Verification or sign-in error:', error);
      let errorMessage = 'Invalid code or sign-in failed. Please try again.';
      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = 'Invalid verification code.';
          break;
        case 'NotAuthorizedException':
          errorMessage = 'Sign-in failed after verification. Please try logging in manually.';
          break;
        case 'ExpiredCodeException':
          errorMessage = 'Verification code has expired. Please request a new one.';
          break;
        case 'LimitExceededException':
          errorMessage = 'Attempt limit exceeded. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setErrors({ verification: errorMessage });
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      console.log('Resending verification code to:', formData.email);
      await resendSignUpCode({ username: formData.email });
      console.log('Verification code resent successfully');
      setErrors({ verification: 'Code resent. Check your email.' });
    } catch (error) {
      console.error('Resend code error:', error);
      let errorMessage = error.message || 'Failed to resend code.';
      switch (error.name) {
        case 'LimitExceededException':
          errorMessage = 'Resend limit exceeded. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setErrors({ verification: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="form-section signup">
        <h2>Verify Your Email</h2>
        <p>A code has been sent to {formData.email}</p>
        <form onSubmit={handleConfirmSignUp}>
          <div className="form-group">
            <label htmlFor="verification-code">Verification Code</label>
            <input
              type="text"
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isLoading}
            />
            {errors.verification && <span className="error">{errors.verification}</span>}
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={isLoading}
          >
            {isLoading ? 'Resending...' : 'Resend Code'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="form-section signup">
      <h2>Join the Community!</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="signup-firstname">First Name</label>
          <Input
            id="signup-firstname"
            type="text"
            placeholder="John"
            icon={<FaUser />}
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="signup-lastname">Last Name</label>
          <Input
            id="signup-lastname"
            type="text"
            placeholder="Doe"
            icon={<FaUser />}
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email Address</label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            icon={<FaEnvelope />}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <PasswordInput
            id="signup-password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <PasswordInput
            id="signup-confirm-password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="terms" required disabled={isLoading} />
          <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      {errors.manualSignUp && <span className="error">{errors.manualSignUp}</span>}
    </div>
  );
}

export default SignUpForm;