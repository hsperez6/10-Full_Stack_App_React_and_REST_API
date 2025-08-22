import { createContext, useState, useEffect } from 'react';
import {
  storeUserInCookies,
  getUserCredentialsFromCookies,
  getUserStateFromCookies,
  clearUserCookies
} from '../utils/cookieUtils.js';

/**
 * UserContext
 *
 * React Context that provides user authentication state and actions throughout the application.
 * This context manages the current user's authentication status, credentials, and provides
 * methods for signing in and signing out users. User state is persisted using HTTP cookies.
 */
const UserContext = createContext(null);

/**
 * UserProvider Component
 *
 * Provider component that wraps the application and provides user authentication context.
 * This component manages user state and provides authentication actions to all child components.
 * User state is automatically restored from cookies on page refresh.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the context
 */
export const UserProvider = (props) => {

  // STATE MANAGEMENT
  const [user, setUser] = useState(null);  // Current authenticated user or null if not signed in
  const [isInitialized, setIsInitialized] = useState(false); // Track if cookies have been checked

  /**
   * Restores user state from cookies on component mount
   * This ensures user authentication persists across page refreshes
   */
  useEffect(() => {
    const restoreUserFromCookies = async () => {
      try {
        // Check if user credentials cookie exists
        const storedCredentials = getUserCredentialsFromCookies();
        const storedUserState = getUserStateFromCookies();

        if (storedCredentials && storedUserState) {
          // Validate stored credentials by making an API call
          const response = await fetch('/api/users', {
            headers: {
              'Authorization': `Basic ${storedCredentials}`
            }
          });

          if (response.ok) {
            // Credentials are still valid, restore user state
            setUser({
              ...storedUserState,
              credentials: storedCredentials
            });
          } else {
            // Credentials are invalid, clear cookies
            clearUserCookies();
          }
        }
      } catch (_error) {
        // Silently handle error - user will need to sign in again
        // Clear invalid cookies on error
        clearUserCookies();
      } finally {
        setIsInitialized(true);
      }
    };

    restoreUserFromCookies();
  }, []);

  /**
   * Helper function to encode string to base64 (browser-compatible)
   * @param {string} str - String to encode
   * @returns {string} Base64 encoded string
   */
  const encodeBase64 = (str) => {
    // Use a simple base64 encoding implementation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }

    let byteNum;
    let chunk;

    for (let i = 0; i < bytes.length; i += 3) {
      byteNum = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      chunk = [
        chars[(byteNum >> 18) & 0x3F],
        chars[(byteNum >> 12) & 0x3F],
        chars[(byteNum >> 6) & 0x3F],
        chars[byteNum & 0x3F]
      ];
      output += chunk.join('');
    }

    return output;
  };

  /**
   * Authenticates a user with email and password
   * Creates Basic Auth credentials and validates them against the API
   * Stores user state in cookies for persistence
   *
   * @param {string} emailAddress - User's email address
   * @param {string} password - User's password
   * @returns {Object} Result object with success status and optional error message
   */
  const signInUser = async (emailAddress, password) => {
    try {
      // Create Basic Auth header by encoding email:password in base64
      const credentials = encodeBase64(`${emailAddress}:${password}`);

      // First, validate credentials by trying to get user info
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        // Authentication successful, get user data from response
        const userData = await response.json();

        // Create authenticated user object with complete information
        const authenticatedUser = {
          id: userData.id,                    // User's unique identifier
          emailAddress,                       // User's email address
          firstName: userData.firstName,      // User's first name
          lastName: userData.lastName,        // User's last name
          credentials                         // Encoded credentials for future API calls
        };

        // Store user data in cookies for persistence
        storeUserInCookies(authenticatedUser, credentials);

        // Update user state with authenticated user information
        setUser(authenticatedUser);
        return { success: true };
      } else {
        if (response.status === 403) {
          // Redirect to forbidden page for authorization errors
          window.location.href = '/forbidden';
          return { success: false, message: 'Access forbidden' };
        }
        if (response.status === 500) {
          // Redirect to error page for server errors
          window.location.href = '/error';
          return { success: false, message: 'Server error occurred' };
        }
        // Authentication failed - handle API error response
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Invalid email address or password'
        };
      }
    } catch (_error) {
      // Handle network or other unexpected errors
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  };

  /**
   * Signs out the current user
   * Clears user state and removes authentication cookies
   */
  const signOutUser = () => {
    setUser(null);
    clearUserCookies();
  };

  // Provide context value to all child components
  return (
    <UserContext.Provider
      value={{
        user,                    // Current user state (null if not authenticated)
        isInitialized,           // Whether cookies have been checked and user state restored
        actions: {               // Authentication action methods
          signIn: signInUser,    // Function to sign in a user
          signOut: signOutUser,  // Function to sign out a user
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
