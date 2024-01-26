import { useContext } from "react";
import { Navbar as BootstrapNavbar, Container, Nav } from "react-bootstrap";
import { FaUserLock } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import UserAvatar from "../user-avatar/UserAvatar";

export default function Navbar() {
  const { isLoggedIn, handleLogout, user } = useContext(AppContext);
  return (
    <BootstrapNavbar
      expand="lg"
      sticky="top"
      className="px-3 py-1 shadow-sm"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to={"/home"}>
          OnTime
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse
          id="navbar-nav"
          className="justify-content-between"
        >
          <Nav>
            {isLoggedIn && (
              <>
                {(user?.roles?.includes("USER") ||
                  user?.roles?.includes("GUEST")) && (
                  <Nav.Link as={Link} to={"/user/bookings"}>
                    <div className="d-flex align-items-center">
                      <MdEventAvailable size={24} className="me-2" />
                      <p className="m-0">My Bookings</p>
                    </div>
                  </Nav.Link>
                )}

                {user?.roles?.includes("ADMIN") && (
                  <>
                    <Nav.Link as={Link} to={"/bookings"}>
                      <div className="d-flex align-items-center">
                        <MdEventAvailable size={24} className="me-2" />
                        <p className="m-0">My Bookings</p>
                      </div>
                    </Nav.Link>
                    <Nav.Link as={Link} to={"/bookings/add"}>
                      <div className="d-flex align-items-center">
                        <FaCalendarPlus size={18} className="me-2" />
                        <p className="m-0">Add</p>
                      </div>
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>

          <Nav>
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to={"/signup"}>
                  <div className="d-flex align-items-center">
                    <FaUserLock size={24} className="me-2" />
                    <p className="m-0">Singup</p>
                  </div>
                </Nav.Link>
                <Nav.Link as={Link} to={"/login"}>
                  <div className="d-flex align-items-center">
                    <FaPowerOff size={24} className="me-2" />
                    <p className="m-0">Login</p>
                  </div>
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <BootstrapNavbar.Text>
                  {isLoggedIn && <UserAvatar username={user?.username} />}
                </BootstrapNavbar.Text>
                <Nav.Link>
                  <div
                    className="d-flex align-items-center"
                    onClick={handleLogout}
                    role="button"
                  >
                    <FaPowerOff size={24} className="me-2" />
                    <p className="m-0">Logout</p>
                  </div>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
