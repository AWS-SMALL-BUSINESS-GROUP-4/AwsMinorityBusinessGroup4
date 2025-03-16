// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import BusinessNavBar from "./components/NavBar";
import BusinessManagementPage from "./pages/BusinessManagementPage";
import SearchResultPage from "./pages/SearchResultPage";
import React from "react";
import "./App.css";
import '../AmplifyClient'; // Import to configure Amplify

// The multi-step routes
import BusinessFormRoutes from "./pages/BusinessFormRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Business Routes */}
        <Route path="/search" element={<SearchResultPage />} />

        {/* Our new multi-step forms, handle /my-businesses/stepX */}
        <Route path="/my-businesses/*" element={<BusinessFormRoutes />} />

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
