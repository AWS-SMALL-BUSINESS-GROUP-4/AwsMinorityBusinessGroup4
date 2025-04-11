// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils'
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null for loading state
  const [userId, setUserId] = useState("");
  const [authLoading, setAuthLoading] = useState(false); // Add loading state

  // Load initial 

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      setAuthLoading(true);
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          setIsAuthenticated(true);
          const response = await getCurrentUser();
          setUserId(response.userId);
          setAuthLoading(false);
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          setIsAuthenticated(false);
          setAuthLoading(false);
          break;
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.');
          break;
        case 'signInWithRedirect_failure':
          console.log('failure while trying to resolve signInWithRedirect API.');
          setIsAuthenticated(false);
          setAuthLoading(false);
          break;
        case 'customOAuthState':
          logger.info('custom state returned from CognitoHosted UI');
          setAuthLoading(false);
          break;
      }
    });

    return () => { unsubscribe() }; // Cleanup subscription on unmount
  }, []);

  useEffect(()=> {
    async function checkAuth() {
      try {
        setAuthLoading(true);
        const session = await fetchAuthSession();
        setIsAuthenticated(session.tokens != null);
        if(isAuthenticated) {
          const response = await getCurrentUser();
          setUserId(response.userId);
        }
      } catch(error) {
        console.error("Error in checkAuth in AuthContext.jsx: ", error);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, [])

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    authLoading, // Expose loading state
    userId,
    setUserId,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
