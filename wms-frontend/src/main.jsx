// src/main.jsx
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ This is the one and only Router wrapper */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
