import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useUserApi from "../../../apis/useUserAPI";
import AppContext from "../../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const [passwordFormData, setPasswordFormData] = useState({
    username: "",
    password: "",
  });
  const [otpFormData, setOtpFormData] = useState({
    email: "",
    otp: "",
  });
  const [transactionId, setTransactionId] = useState("");
  const { login, generateOTP, verifyOTP } = useUserApi();
  const {
    setLogInState,
    showLoader,
    hideLoader,
    handleAPIError,
    handleShowToast,
  } = useContext(AppContext);
  const handleChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleOtpFormChange = (e) => {
    setOtpFormData({
      ...otpFormData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const handleSubmit = async () => {
    try {
      showLoader();
      const { data } = (await login(passwordFormData)).data;
      setLogInState(data.accessToken);
    } catch (err) {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  const handleGetOTP = async () => {
    try {
      showLoader();
      const { data } = (await generateOTP({ email: otpFormData.email })).data;
      setTransactionId(data.transactionId);
      handleShowToast("OTP sent.");
    } catch {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      showLoader();
      const { data } = (
        await verifyOTP({ otp: otpFormData.otp, transactionId })
      ).data;
      setLogInState(data.accessToken);
      handleShowToast("OTP verified.");
    } catch (err) {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  const isFormValid =
    !!passwordFormData.username && !!passwordFormData.password;
  const isEmailValid = !!otpFormData.email;
  const isOTPValid = !!otpFormData.otp;
  return (
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Tabs defaultActiveKey="passwordLogin" fill>
            <Tab eventKey="passwordLogin" title="Have Password?">
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
                          placeholder="Username or Email"
                          value={passwordFormData.username}
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
                          value={passwordFormData.password}
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
            </Tab>
            <Tab eventKey="otpLogin" title="Use OTP">
              <Card>
                <Card.Body>
                  <h2 className="text-center mb-4">Welcome Back!</h2>
                  <Form>
                    <Form.Group controlId="otpEmail">
                      <InputGroup>
                        <InputGroup.Text>
                          <CiUser />
                        </InputGroup.Text>
                        <Form.Control
                          name="email"
                          type="text"
                          placeholder="Email"
                          value={otpFormData.email}
                          onChange={handleOtpFormChange}
                        />
                      </InputGroup>
                    </Form.Group>
                    {!transactionId && (
                      <div className="d-grid gap-2 mt-3">
                        <Button
                          variant="primary"
                          onClick={handleGetOTP}
                          disabled={!isEmailValid}
                        >
                          Get OTP
                        </Button>
                      </div>
                    )}
                    {transactionId && (
                      <>
                        <Form.Group controlId="otp" className="mt-3">
                          <InputGroup>
                            <InputGroup.Text>
                              <RiLockPasswordLine />
                            </InputGroup.Text>
                            <Form.Control
                              name="otp"
                              type="text"
                              placeholder="Enter OTP"
                              value={otpFormData.password}
                              onChange={handleOtpFormChange}
                            />
                          </InputGroup>
                        </Form.Group>
                        <div className="d-grid gap-2 mt-3">
                          <Button
                            variant="primary"
                            onClick={handleVerifyOTP}
                            disabled={!isOTPValid}
                          >
                            Verify OTP
                          </Button>
                        </div>
                      </>
                    )}

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
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
