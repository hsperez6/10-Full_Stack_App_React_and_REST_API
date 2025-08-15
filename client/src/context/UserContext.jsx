import { createContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  
  const [user, setUser] = useState(null);

  const signInUser = async (emailAddress, password) => {
    try {
      // Create Basic Auth header
      const credentials = btoa(`${emailAddress}:${password}`);
      
      // Store user info with credentials for API calls
      const newUser = {
        id: null, // Will be set after successful authentication
        emailAddress,
        password,
        credentials
      };
      setUser(newUser);
      
      // Try to get user info to confirm authentication and get user ID
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(prev => ({
          ...prev,
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName
        }));
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  const signOutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        actions: {
          signIn: signInUser,
          signOut: signOutUser,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;