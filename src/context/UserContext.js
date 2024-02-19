// Modules
import { createContext, useState } from "react";
import Cookies from "js-cookie";
// Initialize Context
const UserContext = createContext(null);

export const UserProvider = (props) => {
  // Retrieve cookie if exists
  const cookie = Cookies.get("authenticatedUser");
  // React Hook to store if user is logged in or out
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  // SignIn Handler
  const signIn = async (credentials) => {
    const fetchOptions = {
      method: 'GET',
      headers: {}
    };
    const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
    fetchOptions.headers.Authorization = `Basic ${encodedCredentials}`;
    try {
      const response = await fetch('http://localhost:5000/api/users', fetchOptions);
      if (response.status === 200) {
        const user = await response.json();
        // Store the decoded password to Cookies. NOT RECOMMENDED! Will need to code in something better
        user.user.password = credentials.password;
        setAuthUser(user);
        Cookies.set("authenticatedUser", JSON.stringify(user), {expires: 1});
        return user;
      } else if (response.status === 401) {
        return null;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  }

  const signOut = () => {
    setAuthUser(null);
    Cookies.remove("authenticatedUser");
  };

  return (
    <UserContext.Provider value={{
      authUser,
      actions: {
        signIn,
        signOut
      }
    }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
