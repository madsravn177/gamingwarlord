import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("username"); // Tjek, om brugeren er logget ind

  if (!isAuthenticated) {
    // Hvis brugeren ikke er logget ind, omdiriger til login-siden
    return <Navigate to="/login" />;
  }

  // Hvis brugeren er logget ind, vis den beskyttede side
  return children;
}

export default ProtectedRoute;