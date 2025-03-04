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
    <div>
      <BusinessManagementPage/>
    </div>
//  <div className="App">
//    <BusinessCreationForm />
//  </div>
  );
}

export default App;