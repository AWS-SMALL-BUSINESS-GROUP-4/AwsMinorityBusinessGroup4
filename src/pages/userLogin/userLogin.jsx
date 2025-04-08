import React, { useEffect } from 'react';
import { Hub } from '@aws-amplify/core';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Footer from './Footer';
import './userLogin.css';

const client = generateClient();

function UserLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const listener = async (data) => {
      if (data.payload.event === 'signIn') {
        try {
          const user = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          const userId = attributes.sub;

          // Check if User record exists; create it if not
          const userRecord = await client.models.User.get({ id: userId });
          if (!userRecord.data) {
            const userData = {
              id: userId,
              name: {
                firstName: attributes.given_name,
                lastName: attributes.family_name,
              },
              email: attributes.email,
              joinedAt: Date.now(),
              lastLogin: Date.now(),
            };
            await client.models.User.create(userData);
          }

          // Check for customState to determine redirect
          const customState = data.payload.data?.customState
            ? JSON.parse(data.payload.data.customState)
            : { redirectTo: '/' }; // Default to homepage
          const redirectTo = customState.redirectTo || '/';
          console.log('User signed in and record handled, redirecting to:', redirectTo);
          navigate(redirectTo);
        } catch (error) {
          console.error('Error handling sign-in:', error);
          navigate('/'); // Fallback to homepage on error
        }
      }
    };

    const unsub = Hub.listen('auth', listener);
    return () => unsub();
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="background"></div>
      <div className="content">
        <Header />
        <div className="slogan">
          <h1>Join the Community – Discover, Rate, and Share!</h1>
        </div>
        <div className="white-container">
          <LoginForm />
          <div className="divider"></div>
          <SignUpForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserLogin;