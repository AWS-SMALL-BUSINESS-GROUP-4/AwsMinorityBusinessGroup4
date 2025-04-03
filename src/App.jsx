// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import BusinessNavBar from "./components/NavBar";
import BusinessManagementPage from "./pages/BusinessManagementPage";
import BusinessManagementPicturesPage from "./pages/BusinessManagementPicturesPage";
import SearchResultPage from "./pages/SearchResultPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import React, { useEffect, useState } from "react";
import { Hub } from 'aws-amplify/utils';
import { AuthProvider } from "./AuthContext";
import "./App.css";
import '../AmplifyClient'; // Import to configure Amplify

// The multi-step routes
import BusinessFormRoutes from "./pages/BusinessFormRoutes";
import { fetchAuthSession, fetchUserAttributes } from "@aws-amplify/auth";

function App() {

  // useEffect(() =>{
  //   async function fetchAuthentication() {
  //     try {
  //       const session = await fetchAuthSession();
  //       console.log(session);
  //       const val = session.tokens == undefined;
  //       console.log(val);
  //       setIsAuthenticated(val);
  //       console.log("Are we authed?: ", isAuthenticated);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }

  //   fetchAuthentication();
  // }, [])


  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/business-login" element={<SearchResultPage />} /> */}

  //       {/* Business Routes */}
  //       <Route path="/search" element={<SearchResultPage />} />

        {/* Our new multi-step forms, handle /my-businesses/stepX */}

        <Route path="/business-profile/:id" element={<BusinessManagementPage />} />
        <Route path="/add-business/*" element={<BusinessFormRoutes />} />
        <Route path="/write-review" element={<ReviewPage />} />
        <Route path="/business/:id" element={<BusinessProfilePage />} />
        <Route path="/business-profile/:id/photos" element={<BusinessManagementPicturesPage/>}/>

        {/* 404 Route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
