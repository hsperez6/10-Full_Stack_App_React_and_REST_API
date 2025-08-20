import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext.jsx';

/**
 * Header Component
 *
 * Navigation header component that displays the application logo and navigation menu.
 * This component conditionally renders different navigation options based on user
 * authentication status. Authenticated users see a welcome message and sign out link,
 * while unauthenticated users see sign up and sign in links.
 * The component waits for user state to be initialized from cookies before rendering.
 */
const Header = () => {
  // Get user authentication status and initialization state from UserContext
  const { user, isInitialized } = useContext(UserContext);

  // Don't render navigation until user state is initialized from cookies
  if (!isInitialized) {
    return (
      <header>
        <div className="wrap header--flex">
          <h1 className="header--logo">
            <Link to="/">Courses</Link>
          </h1>
          <nav>
            <ul className="header--signedout">
              <li>Loading...</li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="wrap header--flex">
        {/* Application logo/title that links to home page */}
        <h1 className="header--logo">
          <Link to="/">Courses</Link>
        </h1>

        {/* Navigation menu - conditionally rendered based on auth status */}
        <nav>
          {user ? (
            // Navigation for authenticated users
            <ul className="header--signedin">
              <li>Welcome, {user.firstName || user.emailAddress}!</li>
              <li>
                <Link to="/signout">Sign Out</Link>
              </li>
            </ul>
          ) : (
            // Navigation for unauthenticated users
            <ul className="header--signedout">
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
