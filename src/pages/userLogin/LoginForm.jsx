import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import Input from './Input';
import PasswordInput from './PasswordInput';
import { FaEnvelope } from 'react-icons/fa';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name === 'email' ? 'Email Address' : 'Password'} is required`;
    }
    if (name === 'email' && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
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
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    return Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.error('Login validation errors:', validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting manual login with:', { email: formData.email });
      const signInResult = await signIn({ username: formData.email, password: formData.password });
      console.log('Sign-in result:', signInResult);
      if (signInResult.isSignedIn) {
        console.log('Sign-in successful');
      } else {
        console.log('Sign-in incomplete, next step:', signInResult.nextStep);
      }
    } catch (error) {
      console.error('Manual login error:', error);
      let errorMessage = 'Failed to log in. Please try again.';
      switch (error.name) {
        case 'NotAuthorizedException':
          errorMessage = 'Incorrect email or password.';
          break;
        case 'UserNotConfirmedException':
          errorMessage = 'Please verify your email before logging in.';
          break;
        case 'InvalidParameterException':
          errorMessage = 'Invalid input provided.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setErrors({ login: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section login">
      <h2>Log In</h2>
      <p>Welcome Back!</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <Input
            id="login-email"
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
          <label htmlFor="login-password">Password</label>
          <PasswordInput
            id="login-password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <a href="#" className="forgot-password">Forgot Password?</a>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      {errors.login && <span className="error">{errors.login}</span>}
    </div>
  );
}

export default LoginForm;