import { Amplify } from 'aws-amplify';
import React from "react";
import { createRoot } from "react-dom/client";
import outputs from '../amplify_outputs.json';
import App from "./App";
import "./App.css";

Amplify.configure(outputs);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
