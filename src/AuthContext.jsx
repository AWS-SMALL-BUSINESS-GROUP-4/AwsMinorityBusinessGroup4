// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils'
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null for loading state
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Load initial 

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          setIsAuthenticated(true);
          const response = await getCurrentUser();
          setUserId(response.userId);
          setLoading(false);
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          setIsAuthenticated(false);
          setLoading(false);
          break;
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.');
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

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  useEffect(()=> {
    async function checkAuth() {
      try {
        const session = await fetchAuthSession();
        console.log("This is session:", session);
        setIsAuthenticated(session.tokens != null);
        if(isAuthenticated)
            setUserId((await getCurrentUser()).userId);
        setLoading(false);
      } catch(error) {
        console.error("Error in checkAuth in AuthContext.jsx: ", error);
      }
    }

    checkAuth();
  }, [])

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    loading, // Expose loading state
    userId,
  };

  console.log

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
