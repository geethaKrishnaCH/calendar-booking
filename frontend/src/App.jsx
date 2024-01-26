import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import Navbar from "./components/common/navbar/Navbar";
import SpinnerLoader from "./components/common/spinner-loader/SpinnerLoader";
import AppContext from "./components/context/AppContext";
import ToastMessage from "./components/common/toast-message/ToastMessage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, toast, handleHideToast } = useContext(AppContext);
  useEffect(() => {
    const pathName = location.pathname;
    if (pathName === "/") {
      navigate("/home");
    }
  }, []);

  return (
    <Container fluid className="g-0">
      {isLoading && <SpinnerLoader />}
      {toast.showToast && (
        <ToastMessage
          message={toast.message}
          show={toast.showToast}
          error={toast.error}
          onClose={handleHideToast}
        />
      )}
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </Container>
  );
}

export default App;
