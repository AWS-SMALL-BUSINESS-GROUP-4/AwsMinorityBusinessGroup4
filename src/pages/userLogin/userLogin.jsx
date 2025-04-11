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
      console.log('Auth event:', data.payload.event);
      if (data.payload.event === 'signIn') {
        try {
          console.log('Auth event: signIn detected');
          const user = await getCurrentUser();
          console.log('Got current user:', user);
          const attributes = await fetchUserAttributes();
          console.log('Got user attributes:', attributes);
          const userId = attributes.sub;
          console.log('Authenticated user:', { userId, email: attributes.email });

          const userRecord = await client.models.User.get({ id: userId });
          if (!userRecord.data) {
            const userData = {
              id: userId,
              name: {
                firstName: attributes.given_name || '',
                lastName: attributes.family_name || '',
              },
              email: attributes.email,
              joinedAt: Date.now(),
              lastLogin: Date.now(),
            };
            console.log('Creating new user record:', userData);
            const createResponse = await client.models.User.create(userData);
            if (createResponse.errors) {
              throw new Error(createResponse.errors[0].message);
            }
            console.log('User record created successfully');
          } else {
            console.log('User record exists, updating lastLogin');
            await client.models.User.update({
              id: userId,
              lastLogin: Date.now(),
            });
          }

          console.log('Redirecting to homepage');
          navigate('/');
        } catch (error) {
          console.error('Error in Hub listener:', error);
          navigate('/'); // Fallback navigation
        }
      } else if (data.payload.event === 'signIn_failure') {
        console.error('Sign-in failure:', data.payload.data);
      }
    };

    console.log('Setting up auth listener');
    const unsub = Hub.listen('auth', listener);
    return () => {
      console.log('Cleaning up auth listener');
      unsub();
    };
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