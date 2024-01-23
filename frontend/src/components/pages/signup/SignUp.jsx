import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../apis/axios-hook/useAxios";
import AppContext from "../../context/AppContext";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const apiClient = useAxios();
  const { register } = useUserApi(apiClient);
  const { setLogInState } = useContext(AppContext);
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = async () => {
    // const response = await apiClient.post("user/register", formData);
    const response = (await register(formData)).data;
    setLogInState(response.data.accessToken);
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
                <FormGroup controlId="username">
                  <FloatingLabel controlId="floatingUsername" label="Username">
                    <Form.Control
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </FormGroup>

                <FormGroup controlId="email" className="mt-3">
                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Email Address"
                  >
                    <Form.Control
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </FormGroup>
                <FormGroup controlId="password" className="mt-3">
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </FormGroup>
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
