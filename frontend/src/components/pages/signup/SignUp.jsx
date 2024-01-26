import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import useUserApi from "../../../apis/useUserAPI";
import AppContext from "../../context/AppContext";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isAdmin, setAdmin] = useState(false);
  const { register } = useUserApi();
  const {
    setLogInState,
    handleAPIError,
    showLoader,
    hideLoader,
    handleShowToast,
  } = useContext(AppContext);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      if (isAdmin) {
        payload.roles = ["ADMIN"];
      }
      showLoader();
      const { data } = (await register(payload)).data;
      setLogInState(data.accessToken);
      handleShowToast("Successfully registered.");
    } catch (err) {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  const navigateToSignIn = () => {
    navigate("/login");
  };

  const isFormValid =
    !!formData.username && !!formData.password && !!formData.email;
  return (
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign up</h2>
              <Form>
                <Form.Group controlId="username">
                  <InputGroup>
                    <InputGroup.Text>
                      <CiUser />
                    </InputGroup.Text>
                    <Form.Control
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="email" className="mt-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <MdOutlineEmail />
                    </InputGroup.Text>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="password" className="mt-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <RiLockPasswordLine />
                    </InputGroup.Text>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="isAdmin" className="mt-3">
                  <InputGroup>
                    <InputGroup.Text>Register as Admin?</InputGroup.Text>
                    <InputGroup.Checkbox
                      name="isAdmin"
                      checked={isAdmin}
                      onChange={(e) => setAdmin(e.target.checked)}
                    />
                  </InputGroup>
                </Form.Group>
                <div className="d-grid gap-2 mt-3">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                  >
                    Get Started
                  </Button>
                </div>
                <Row className="mt-3">
                  <Col>
                    <span>Already a member?</span>
                    <Button variant="link" onClick={navigateToSignIn}>
                      Sign in!
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
