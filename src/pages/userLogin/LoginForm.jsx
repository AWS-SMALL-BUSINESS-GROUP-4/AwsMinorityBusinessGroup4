import React, { useState } from 'react';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';
import Input from './Input';
import PasswordInput from './PasswordInput';
import { FaEnvelope, FaGoogle, FaFacebook } from 'react-icons/fa';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setErrors({ login: 'Email and password are required' });
      return;
    }
    try {
      await signIn({ username: email, password });
      // Hub listener in UserLogin.jsx will redirect to homepage
    } catch (error) {
      let errorMessage = 'Failed to log in. Please try again.';
      if (error.name === 'NotAuthorizedException') errorMessage = 'Incorrect email or password.';
      setErrors({ login: errorMessage });
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect({
        provider: 'Google',
        customState: JSON.stringify({ redirectTo: '/' }), // Indicate homepage redirect
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <PasswordInput
            id="login-password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <a href="#" className="forgot-password">Forgot Password?</a>
        <button type="submit" className="submit-button">Log In</button>
      </form>
      {errors.login && <span className="error">{errors.login}</span>}
      <p className="or-text">Or log in with:</p>
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

export default LoginForm;