import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext); // Access your context

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
