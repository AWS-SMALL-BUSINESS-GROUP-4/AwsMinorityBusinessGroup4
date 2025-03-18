import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import config from '../amplify_outputs.json'; // Adjust path if needed
import App from './App';
import './App.css';

// Configure Amplify with sandbox outputs
Amplify.configure(config);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);