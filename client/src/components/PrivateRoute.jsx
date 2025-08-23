import React from 'react';
import { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext.jsx';

/**
 * PrivateRoute Component
 *
 * Route guard component that protects routes requiring user authentication.
 * This component checks if a user is authenticated and either renders the
 * protected route content (via Outlet) or redirects unauthenticated users
 * to the sign-in page with the intended destination stored in state.
 * The component waits for user state to be initialized from cookies before
 * making authentication decisions.
 *
 * @param {Object} props - Component props (unused but destructured for future use)
 * @returns {JSX.Element} Either the protected route content, a redirect, or loading state
 */
const PrivateRoute = () => {
  // Get user authentication status and initialization state from UserContext
  const { user, isInitialized } = useContext(UserContext);

  // Get current location to capture intended destination
  const location = useLocation();

  // If user state is not yet initialized from cookies, show loading
  if (!isInitialized) {
    return (
      <div className="wrap">
        <h2>Loading...</h2>
        <p>Please wait while we restore your session...</p>
      </div>
    );
  }

  // If user is authenticated, render the Outlet (child routes)
  // If user is not authenticated, redirect to sign-in page with intended destination
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to="/signin"
      state={{ from: location.pathname + location.search }}
      replace
    />
  );
};

export default PrivateRoute;
