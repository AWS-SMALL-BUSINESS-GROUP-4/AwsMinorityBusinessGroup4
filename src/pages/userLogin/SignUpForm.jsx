import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn, signInWithRedirect } from 'aws-amplify/auth';
import Input from './Input';
import PasswordInput from './PasswordInput';
import { FaUser, FaEnvelope, FaGoogle, FaFacebook } from 'react-icons/fa';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSignUp = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last Name is required';
    if (!formData.email.trim()) errors.email = 'Email Address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?]).{8,}$/.test(formData.password))
      errors.password = 'Password must be at least 8 characters long and include letters, numbers, and symbols';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignUp();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            given_name: formData.firstName,
            family_name: formData.lastName,
          },
        },
      });
      setIsVerifying(true);
    } catch (error) {
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.name === 'UsernameExistsException') errorMessage = 'An account with this email already exists.';
      setErrors({ manualSignUp: errorMessage });
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: verificationCode,
      });
      await signIn({
        username: formData.email,
        password: formData.password,
      });
      // Hub listener in UserLogin.jsx will redirect to homepage
    } catch (error) {
      let errorMessage = 'Invalid code or sign-in failed. Please try again.';
      if (error.name === 'CodeMismatchException') errorMessage = 'Invalid verification code.';
      setErrors({ verification: errorMessage });
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect({
        provider: 'Google',
        customState: JSON.stringify({ redirectTo: '/' }),
      });
    } catch (error) {
      setErrors({ google: 'Failed to sign in with Google.' });
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithRedirect({
        provider: 'Facebook',
        customState: JSON.stringify({ redirectTo: '/' }),
      });
    } catch (error) {
      setErrors({ facebook: 'Failed to sign in with Facebook.' });
    }
  };

  if (isVerifying) {
    return (
      <div className="form-section signup">
        <h2>Verify Your Email</h2>
        <form onSubmit={handleConfirmSignUp}>
          <div className="form-group">
            <label htmlFor="verification-code">Verification Code</label>
            <input
              type="text"
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          {errors.verification && <span className="error">{errors.verification}</span>}
          <button type="submit" className="submit-button">Verify</button>
        </form>
      </div>
    );
  }

  return (
    <div className="form-section signup">
      <h2 channel="auth">Join the Community!</h2>
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
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      {errors.manualSignUp && <span className="error">{errors.manualSignUp}</span>}
      <p className="or-text">Or sign up with:</p>
      <div className="social-buttons">
        <button className="social-button google" onClick={signInWithGoogle}>
          <FaGoogle /> Google
        </button>
        <button className="social-button facebook" onClick={signInWithFacebook}>
          <FaFacebook /> Facebook
        </button>
      </div>
      {errors.google && <span className="error">{errors.google}</span>}
      {errors.facebook && <span className="error">{errors.facebook}</span>}
    </div>
  );
}

export default SignUpForm;