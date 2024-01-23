import { createContext, useEffect, useState } from "react";
import useUserApi from "../../apis/useUserAPI";
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { logout, refreshToken } = useUserApi();

  const handleLogout = () => {
    // remove accessToken
    setLoggedIn(false);
    logout();
  };

  const setLogInState = (token) => {
    localStorage.setItem("accessToken", token);
    setLoggedIn(true);
  };

  async function getAccessToken() {
    const response = (await refreshToken()).data;
    // set accessToken
    setLoggedIn(true);
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setLoggedIn(true);
    }
  }, []);
  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        handleLogout,
        setLogInState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
