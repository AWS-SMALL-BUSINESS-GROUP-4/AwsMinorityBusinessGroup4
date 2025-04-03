// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils'
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null for loading state
  const [loading, setLoading] = useState(true); // Add loading state

  // Load initial 

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          setIsAuthenticated(true);
          setLoading(false);
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          setIsAuthenticated(true);
          setLoading(false);
          break;
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.');
          setIsAuthenticated(true);
          setLoading(false);
          break;
        case 'signInWithRedirect_failure':
          console.log('failure while trying to resolve signInWithRedirect API.');
          setIsAuthenticated(false);
          setLoading(false);
          break;
        case 'customOAuthState':
          logger.info('custom state returned from CognitoHosted UI');
          setLoading(false);
          break;
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(()=> {
    async function checkAuth() {
      const session = await fetchAuthSession();
      console.log("This is session:", session);
      setIsAuthenticated(session.tokens != null);
      setLoading(false);
    }

    checkAuth();
  }, [])

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    loading, // Expose loading state
  };

  console.log

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
