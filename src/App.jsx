import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import SearchResultPage from "./components/SearchResultPage";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BusinessNavBar from './components/BusinessNavBar'
import BusinessManagementPage from './pages/BusinessManagementPage'
import React from 'react';
import BusinessCreationForm from './pages/BusinessCreationForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Routes */}
        {/* <Route path="/search" element={<SearchResultPage />} /> */}

        {/* Business Routes */}
        <Route
          path="/search"
          element={<div>Search Result Page (Coming Soon)</div>}
        />

        <Route
          path="/my-businesses"
          element={<div>My Businesses Page (Coming Soon)</div>}
        />
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
    // <div>
    //   <BusinessManagementPage/>
    // </div>
//  <div className="App">
//    <BusinessCreationForm />
//  </div>
  // );
}

export default App;