import React from "react";
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";

/**
 * PrivateRoute Component
 * 
 * Route guard component that protects routes requiring user authentication.
 * This component checks if a user is authenticated and either renders the
 * protected route content (via Outlet) or redirects unauthenticated users
 * to the sign-in page.
 * 
 * @param {Object} props - Component props (unused but destructured for future use)
 * @returns {JSX.Element} Either the protected route content or a redirect
 */
const PrivateRoute = ({ children, ...rest }) => {
  // Get user authentication status from UserContext
  const { user } = useContext(UserContext);
  
  // If user is authenticated, render the Outlet (child routes)
  // If user is not authenticated, redirect to sign-in page
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;