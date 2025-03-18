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
import BusinessProfilePage from "./pages/BusinessProfilePage";
function App() {
  return (
    //   <div>
    //     <ReviewPage/>
    //   </div>
    // )

    /*return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )*/
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Routes */}
        {/* <Route path="/search" element={<SearchResultPage />} /> */}
        {/* <Route path="/business-login" element={<SearchResultPage />} /> */}

        {/* Business Routes */}
        <Route path="/search" element={<SearchResultPage />} />

        <Route path="/add-business" element={<BusinessCreationForm />} />
        <Route path="/write-review" element={<ReviewPage />} />
        <Route path="/business/:id" element={<BusinessProfilePage />} />

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

/* Old page rendering for Business Search Result Page*/
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<SearchResultPage />} />
//         <Route path="/search" element={<SearchResultPage />} />
//         <Route path="*" element={<div>404 Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// }

export default App;
