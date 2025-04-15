// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { Hub } from "@aws-amplify/core";
import { getCurrentUser } from "aws-amplify/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check initial auth state on mount
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setIsLoggedIn(true);
        setUser(currentUser);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkUser();

    // Listen for auth events
    const listener = (data) => {
      switch (data.payload.event) {
        case "signedIn":
          setIsLoggedIn(true);
          getCurrentUser()
            .then((currentUser) => setUser(currentUser))
            .catch(() => setUser(null));
          break;
        case "signedOut":
          setIsLoggedIn(false);
          setUser(null);
          break;
        case "signIn_failure":
        case "signOut_failure":
          setIsLoggedIn(false);
          setUser(null);
          break;
        default:
          break;
      }
    };

    // Store the unsubscribe function returned by Hub.listen
    const unsubscribe = Hub.listen("auth", listener);
    return () => unsubscribe(); // Call the unsubscribe function to clean up
  }, []);

  const logout = async () => {
    try {
      await import("aws-amplify/auth").then(({ signOut }) => signOut());
      // The Hub listener will handle updating the state
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}