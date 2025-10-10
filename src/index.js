import React from "react";
import ReactDOM from "react-dom/client"; // Bemærk brugen af 'react-dom/client'
import "./index.css";
import "./styles/global.css"; // Globale styles
import "./styles/colors.css"; // Farver
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Brug createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
