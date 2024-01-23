import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const AuthorizationRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);

  if (isLoggedIn) {
    return <Navigate to="/home" replace />; // Redirect to desired page on login
  }

  return children;
};

export default AuthorizationRoute;
