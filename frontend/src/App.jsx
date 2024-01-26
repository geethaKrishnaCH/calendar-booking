import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import Navbar from "./components/common/navbar/Navbar";
import SpinnerLoader from "./components/common/spinner-loader/SpinnerLoader";
import AppContext from "./components/context/AppContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useContext(AppContext);
  useEffect(() => {
    const pathName = location.pathname;
    if (pathName === "/") {
      navigate("/home");
    }
  }, []);

  return (
    <Container fluid className="g-0">
      {isLoading && <SpinnerLoader />}
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </Container>
  );
}

export default App;
