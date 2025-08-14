import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext.jsx";

import "../global.css";

const UserSignIn = () => {
  const { actions } = useContext(UserContext);

  // State
  const emailAddress = useRef(null);
  const password = useRef(null);

  const navigate = useNavigate();

  // Event Handlers
  const handleSubmit = (event) => {
    event.preventDefault();
    actions.signIn(emailAddress.current.value, password.current.value);
    navigate("/");
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="form--centered">
      <h2>Sign In</h2>

      <form>
        <label htmlFor="emailAddress">Email Address</label>
        <input id="emailAddress" name="emailAddress" type="email" value="" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value="" />
        <button className="button" type="submit" onClick={handleSubmit}>
          Sign In
        </button>
        <button
          className="button button-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
      <p>
        Don't have a user account? Click here to{" "}
        <a href="/signup">sign up</a>!
      </p>
    </div>
  );
};

export default UserSignIn;
