import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext); // Access your context

  return isLoggedIn ? children : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
