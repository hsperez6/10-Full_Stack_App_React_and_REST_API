import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext.jsx';
import ValidationErrors from './ValidationErrors.jsx';

/**
 * UserSignUp Component
 *
 * Form component that handles new user registration by collecting user information.
 * This component manages form state, handles user creation through the API,
 * displays validation errors, and automatically signs in the user upon successful
 * registration. It provides a seamless onboarding experience for new users.
 */
const UserSignUp = () => {
  // STATE MANAGEMENT
  const [firstName, setFirstName] = useState('');     // User's first name
  const [lastName, setLastName] = useState('');       // User's last name
  const [emailAddress, setEmailAddress] = useState(''); // User's email address
  const [password, setPassword] = useState('');       // User's password
  const [errors, setErrors] = useState([]);           // Validation and API errors
  const [loading, setLoading] = useState(false);      // Loading state during form submission

  // Navigation function for redirects
  const navigate = useNavigate();

  // Get authentication actions from UserContext
  const { actions } = useContext(UserContext);

  /**
   * Handles form submission for user registration
   * Creates a new user account and automatically signs them in
   * @param {Event} event - The form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Prepare user data for API submission
      const user = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password
      };

      // Send POST request to create new user account
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        // User created successfully, automatically sign them in
        const signInResult = await actions.signIn(emailAddress, password);
        if (signInResult.success) {
          // Redirect to courses list after successful sign-in
          navigate('/');
        } else {
          // Sign in failed after user creation
          setErrors([`User created successfully, but sign in failed: ${signInResult.message}`]);
        }
      } else {
        if (response.status === 403) {
          navigate('/forbidden');
          return;
        }
        if (response.status === 500) {
          navigate('/error');
          return;
        }
        // Handle API error responses
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors(['Failed to create user. Please try again.']);
        }
      }
    } catch (err) {
      // Handle network or other errors
      console.error('Error creating user:', err);
      setErrors(['Failed to create user. Please try again.']);
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
      <h2>Sign Up</h2>

      {/* Display validation errors if any exist */}
      <ValidationErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        {/* First name input field */}
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        {/* Last name input field */}
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}

        />

        {/* Email address input field */}
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />

        {/* Password input field */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit button - disabled during form submission */}
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Creating User...' : 'Sign Up'}
        </button>

        {/* Cancel button - redirects to courses list */}
        <button
          className="button button-secondary"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>

      {/* Link to sign in page for existing users */}
      <p>Already have a user account? Click here to <a href="/signin">sign in</a>!</p>
    </div>
  );
};

export default UserSignUp;
