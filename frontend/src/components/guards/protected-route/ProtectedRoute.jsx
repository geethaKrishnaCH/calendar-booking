import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppContext from "../../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, user } = useContext(AppContext);
  const ALLOWED_ROUTES = {
    GUEST: ["/home", "/user/bookings"],
    USER: ["/home", "/user/bookings"],
    ADMIN: ["/home", "/bookings", "/bookings/add"],
  };

  if (isLoggedIn) {
    const ROLE = user.roles[0];
    if (ALLOWED_ROUTES[ROLE].includes(location.pathname)) {
      return children;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return isLoggedIn ? children : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
