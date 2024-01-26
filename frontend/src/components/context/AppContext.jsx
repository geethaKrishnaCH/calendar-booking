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
  setCategories: () => {},
  hideLoader: () => {},
  showLoader: () => {},
  handleAPIError: () => {},
  toast: null,
  handleShowToast: (message, error) => {},
  handleHideToast: () => {},
});

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    showToast: false,
    message: "",
    error: false,
  });
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const { getProfile } = useUserApi();
  const { getCategories } = useCategoryApi();

  let loaderCount = 0;
  const showLoader = () => {
    if (!isLoading) setLoading(true);
    loaderCount = loaderCount + 1;
  };

  const hideLoader = () => {
    loaderCount = loaderCount - 1;
    if (loaderCount === 0) setLoading(false);
  };

  const handleAPIError = (err) => {
    if (err?.response.status === 401) {
      handleLogout();
      handleShowToast("Session has timed out!", true);
    } else if (err?.response.status === 403) {
      handleShowToast("Access denied!", true);
    } else if (err?.response.status === 400) {
      handleShowToast(err.response?.data?.message, true);
    } else {
      handleShowToast("Unknown Error", true);
    }
  };

  const handleShowToast = (message, error = false) => {
    setToast({
      showToast: true,
      message,
      error,
    });
    setTimeout(() => {
      handleHideToast();
    }, 3000);
  };
  const handleHideToast = () => {
    if (toast.showToast) {
      setToast({
        showToast: false,
        message: "",
        error: false,
      });
    }
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
        handleAPIError(err);
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
        handleAPIError(err);
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
        setCategories,
        hideLoader,
        showLoader,
        isLoading,
        handleAPIError,
        toast,
        handleShowToast,
        handleHideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
