// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import BusinessManagementPage from "./pages/BusinessManagementPage";
import BusinessManagementPicturesPage from "./pages/BusinessManagementPicturesPage";
import SearchResultPage from "./pages/SearchResultPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import React, { useEffect, useState } from "react";
//import { AuthProvider } from "./AuthContext";
import AuthCallback from "./pages/AuthCallback";
import "./App.css";
import "../AmplifyClient"; // Import to configure Amplify
import { AuthProvider } from "./context/AuthContext";

// The multi-step routes
import BusinessFormRoutes from "./pages/BusinessFormRoutes";
import { fetchAuthSession, fetchUserAttributes } from "@aws-amplify/auth";
import UserLogin from "./pages/userLogin/userLogin"; // Add this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin />} /> Add this route
          {/* Business Routes */}
          <Route path="/search" element={<SearchResultPage />} />
          {/* Our new multi-step forms, handle /my-businesses/stepX */}
          <Route
            path="/business-profile/:id"
            element={<BusinessManagementPage />}
          />
          <Route
            path="/business-profile"
            element={<BusinessManagementPage />}
          />
          <Route path="/add-business/*" element={<BusinessFormRoutes />} />
          <Route path="/write-review" element={<ReviewPage />} />
          <Route path="/write-review/:id" element={<ReviewPage />} />
          <Route path="/business/:id" element={<BusinessProfilePage />} />
          <Route
            path="/business-profile/:id/photos"
            element={<BusinessManagementPicturesPage />}
          />
          <Route path="/callback" element={<AuthCallback />} />
          {/* 404 Route */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
