import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/common/sidebar/Sidebar";
import styles from "./App.module.css";
import useAxios from "./apis/axios-hook/useAxios";
import AppContext from "./components/context/AppContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const apiClient = useAxios();
  const { handleLogout } = useContext(AppContext);
  useEffect(() => {
    const pathName = location.pathname;
    if (pathName === "/") {
      navigate("/home");
    }
  }, []);

  return (
    <Container fluid className="g-0">
      <Row className="g-0">
        <Col xs="1">
          <Sidebar />
        </Col>
        <Col>
          <div className={styles.content}>
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
