import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ReviewPage from "./pages/ReviewPage";
import BusinessNavBar from "./components/NavBar";
import BusinessManagementPage from "./pages/BusinessManagementPage";
import React from "react";
import BusinessCreationForm from "./pages/BusinessCreationForm";
import SearchResultPage from "./pages/SearchResultPage";
// import Amplify from 'aws-amplify';
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Routes */}
        {/* <Route path="/search" element={<SearchResultPage />} /> */}

        {/* Business Routes */}
        <Route path="/search" element={<SearchResultPage />} />

        <Route path="/my-businesses" element={<BusinessCreationForm />} />
        <Route path="/business-profile" element={<BusinessManagementPage />} />
        <Route
          path="/write-review"
          element={<div>Write Review Page (Coming Soon)</div>}
        />
        <Route
          path="/business/:id"
          element={<div>Business Detail Page (Coming Soon)</div>}
        />

        {/* 404 Route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;