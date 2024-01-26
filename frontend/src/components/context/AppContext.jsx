import { createContext, useEffect, useState } from "react";
import useUserApi from "../../apis/useUserAPI";
import useCategoryApi from "../../apis/useCategoryApi";
const AppContext = createContext({
  isLoggedIn: null,
  handleLogout: () => {},
  setLogInState: () => {},
  user: null,
  isLoading: null,
  categories: [],
  hideLoader: () => {},
  showLoader: () => {},
});

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [loaderCount, setLoaderCount] = useState(0);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const { getProfile } = useUserApi();
  const { getCategories } = useCategoryApi();

  let loaderCount_ = 0;
  const showLoader = () => {
    if (!isLoading) setLoading(true);
    loaderCount_ = loaderCount_ + 1;
  };

  const hideLoader = () => {
    loaderCount_ = loaderCount_ - 1;
    if (loaderCount_ === 0) setLoading(false);
  };

  const handleLogout = () => {
    // remove accessToken
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  const setLogInState = (token) => {
    localStorage.setItem("accessToken", token);
    setLoggedIn(true);
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setLoggedIn(true);
    } else {
      handleLogout();
    }
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        showLoader();
        const { data } = (await getCategories()).data;
        setCategories(data);
      } catch (err) {
      } finally {
        hideLoader();
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        showLoader();
        const response = (await getProfile()).data;
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (err) {
        if (err?.response.status === 401) {
          handleLogout();
        }
      } finally {
        hideLoader();
      }
    }
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);
  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        handleLogout,
        setLogInState,
        user,
        categories,
        hideLoader,
        showLoader,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
