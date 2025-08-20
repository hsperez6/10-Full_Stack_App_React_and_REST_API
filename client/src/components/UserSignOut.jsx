import React, { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext.jsx';

/**
 * UserSignOut Component
 *
 * Component that handles user sign-out functionality automatically.
 * This component triggers the sign-out action when it mounts and immediately
 * redirects the user to the home page. It's designed to be a simple,
 * automatic sign-out process without requiring user interaction.
 */
const UserSignOut = () => {
  // Get sign-out action from UserContext
  const { actions } = useContext(UserContext);

  /**
   * useEffect hook that automatically triggers sign-out when component mounts
   * This ensures the user is signed out immediately upon visiting this route
   */
  useEffect(() => actions.signOut());

  // Redirect to home page after sign-out
  return (
    <Navigate to="/" replace />
  );
};

export default UserSignOut;
