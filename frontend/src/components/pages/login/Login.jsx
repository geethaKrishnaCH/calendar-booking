import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useUserApi from "../../../apis/useUserAPI";
import AppContext from "../../context/AppContext";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login } = useUserApi();
  const { setLogInState } = useContext(AppContext);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const handleSubmit = async () => {
    const response = (await login(formData)).data;
    setLogInState(response.data.accessToken);
  };
  const isFormValid = !!formData.username && !!formData.password;
  return (
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Welcome Back!</h2>
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
                <div className="d-grid gap-2 mt-3">
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                  >
                    Sign In
                  </Button>
                </div>
                <Row className="mt-3">
                  <Col>
                    Don't have an account yet?
                    <Button variant="link" onClick={navigateToSignUp}>
                      Create one!
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

export default Login;
