import { createContext, useState } from "react";

/**
 * UserContext
 * 
 * React Context that provides user authentication state and actions throughout the application.
 * This context manages the current user's authentication status, credentials, and provides
 * methods for signing in and signing out users.
 */
const UserContext = createContext(null);

/**
 * UserProvider Component
 * 
 * Provider component that wraps the application and provides user authentication context.
 * This component manages user state and provides authentication actions to all child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the context
 */
export const UserProvider = (props) => {
  
  // STATE MANAGEMENT
  const [user, setUser] = useState(null);  // Current authenticated user or null if not signed in

  /**
   * Authenticates a user with email and password
   * Creates Basic Auth credentials and validates them against the API
   * 
   * @param {string} emailAddress - User's email address
   * @param {string} password - User's password
   * @returns {Object} Result object with success status and optional error message
   */
  const signInUser = async (emailAddress, password) => {
    try {
      // Create Basic Auth header by encoding email:password in base64
      const credentials = btoa(`${emailAddress}:${password}`);
      
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
        
        // Update user state with authenticated user information
        setUser(authenticatedUser);
        return { success: true };
      } else {
        // Authentication failed - handle API error response
        const errorData = await response.json();
        return { 
          success: false, 
          message: errorData.message || 'Invalid email address or password' 
        };
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error('Error during sign in:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  /**
   * Signs out the current user
   * Clears user state and removes authentication
   */
  const signOutUser = () => {
    setUser(null);
  };

  // Provide context value to all child components
  return (
    <UserContext.Provider
      value={{
        user,                    // Current user state (null if not authenticated)
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