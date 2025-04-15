// src/pages/userLogin/UserLogin.jsx
import React, { useEffect } from "react";
import { Hub } from "@aws-amplify/core";
import { getCurrentUser } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Footer from "../../components/Footer"; // Use the main Footer
import "./userLogin.css";

function UserLogin() {
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getCurrentUser();
        console.log("User is already authenticated, redirecting to homepage");
        navigate("/"); // Redirect to homepage if already signed in
      } catch (error) {
        console.log("No user authenticated, staying on login page");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Listen for sign-in events to redirect
  useEffect(() => {
    const listener = async (data) => {
      console.log("Hub event:", data.payload.event);
      if (data.payload.event === "signedIn") {
        console.log("Auth event: signIn detected");
        console.log("Redirecting to homepage");
        navigate("/");
        console.log("Navigation attempted");
      } else if (data.payload.event === "signIn_failure") {
        console.error("Sign-in failure:", data.payload.data);
      }
    };

    console.log("Setting up auth listener");
    const unsub = Hub.listen("auth", listener);
    return () => {
      console.log("Cleaning up auth listener");
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