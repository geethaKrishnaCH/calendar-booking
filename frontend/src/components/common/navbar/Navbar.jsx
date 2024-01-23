import { Navbar as BootstrapNavbar, Container, Nav } from "react-bootstrap";
import { FaUserLock } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserAvatar from "../user-avatar/UserAvatar";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

export default function Navbar() {
  const { isLoggedIn, handleLogout } = useContext(AppContext);
  return (
    <>
      <BootstrapNavbar expand="lg" sticky="top" className="px-3 py-1">
        <Container fluid>
          <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
          <BootstrapNavbar.Collapse
            id="navbar-nav"
            className="justify-content-between"
          >
            <BootstrapNavbar.Text>
              <UserAvatar />
            </BootstrapNavbar.Text>
            {!isLoggedIn && (
              <Nav>
                <Nav.Link as={Link} to={"/signup"}>
                  <div className="d-flex align-items-center">
                    <FaUserLock size={24} className="mx-2" />
                    <p className="fw-bold m-0">Singup</p>
                  </div>
                </Nav.Link>
                <Nav.Link as={Link} to={"/login"}>
                  <div className="d-flex align-items-center">
                    <FiLogIn size={24} className="mx-2" />
                    <p className="fw-bold m-0">Login</p>
                  </div>
                </Nav.Link>
              </Nav>
            )}
            {isLoggedIn && (
              <Nav>
                <Nav.Link>
                  <div
                    className="d-flex align-items-center"
                    onClick={handleLogout}
                    role="button"
                  >
                    <FiLogOut size={24} className="mx-2" />
                    <p className="fw-bold m-0">Logout</p>
                  </div>
                </Nav.Link>
              </Nav>
            )}
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </>
  );
}
