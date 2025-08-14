import { createContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  
  const [user, setUser] = useState(null);

  const signInUser = (username, password) => {
    const newUser = {
      username,
      password,
    };
    setUser(newUser);
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