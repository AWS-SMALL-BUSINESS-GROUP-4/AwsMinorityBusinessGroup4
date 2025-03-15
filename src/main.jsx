import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Configure Amplify
Amplify.configure(outputs);

// Render the app
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
