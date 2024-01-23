import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
                <FormGroup controlId="username">
                  <Form.Control
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="password" className="mt-3">
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormGroup>
                <div className="d-grid gap-2 mt-3">
                  <Button
                    variant="primary"
                    type="submit"
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
