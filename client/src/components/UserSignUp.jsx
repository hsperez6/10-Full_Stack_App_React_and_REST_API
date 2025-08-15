import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";

const UserSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const user = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        // User created successfully, automatically sign them in
        await actions.signIn(emailAddress, password);
        // Redirect to courses list
        navigate("/");
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors(['Failed to create user. Please try again.']);
        }
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setErrors(['Failed to create user. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
      
      {errors.length > 0 && (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input 
          id="firstName" 
          name="firstName" 
          type="text" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          required
        />
        <label htmlFor="lastName">Last Name</label>
        <input 
          id="lastName" 
          name="lastName" 
          type="text" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          required
        />
        <label htmlFor="emailAddress">Email Address</label>
        <input 
          id="emailAddress" 
          name="emailAddress" 
          type="email" 
          value={emailAddress} 
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Creating User...' : 'Sign Up'}
        </button>
        <button 
          className="button button-secondary" 
          type="button" 
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
      <p>Already have a user account? Click here to <a href="/signin">sign in</a>!</p>
    </div>
  );
};

export default UserSignUp;