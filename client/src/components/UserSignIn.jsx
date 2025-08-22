import React, { useRef, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext.jsx';
import ValidationErrors from './ValidationErrors.jsx';

import '../global.css';

/**
 * UserSignIn Component
 *
 * Form component that handles user authentication by collecting email and password.
 * This component manages form state, handles authentication through UserContext,
 * displays validation errors, and redirects users to their intended destination
 * after successful sign-in. Uses useRef for form inputs to avoid unnecessary re-renders.
 */
const UserSignIn = () => {
  // Get authentication actions from UserContext
  const { actions } = useContext(UserContext);

  // STATE MANAGEMENT
  const [errors, setErrors] = useState([]);          // Validation and authentication errors
  const [loading, setLoading] = useState(false);     // Loading state during form submission

  // Form input references using useRef for performance optimization
  const emailAddress = useRef(null);
  const password = useRef(null);

  // Navigation function for redirects
  const navigate = useNavigate();

  // Get location to access intended destination from navigation state
  const location = useLocation();

  /**
   * Handles form submission for user authentication
   * Attempts to sign in the user and handles success/failure responses
   * @param {Event} event - The form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Attempt to sign in using credentials from form
      const result = await actions.signIn(emailAddress.current.value, password.current.value);

      if (result.success) {
        // Sign in successful, redirect to intended destination or default to courses list
        const intendedDestination = location.state?.from || '/';
        navigate(intendedDestination);
      } else {
        // Sign in failed, show error message from API
        setErrors([result.message]);
      }
    } catch (_error) {
      // Handle unexpected errors during sign-in process
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form cancellation
   * Redirects user back to the courses list
   * @param {Event} event - The cancel button click event
   */
  const handleCancel = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div className="form--centered">
      <h2>Sign In</h2>

      {/* Display validation errors if any exist */}
      <ValidationErrors errors={errors} />

      <form>
        {/* Email address input field */}
        <label htmlFor="emailAddress">Email Address</label>
        <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} />

        {/* Password input field */}
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" ref={password} />

        {/* Submit button - disabled during form submission */}
        <button className="button" type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Cancel button - redirects to courses list */}
        <button
          className="button button-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </form>

      {/* Link to sign up page for new users */}
      <p>
        Don&apos;t have a user account? Click here to{' '}
        <a href="/signup">sign up</a>!
      </p>
    </div>
  );
};

export default UserSignIn;
