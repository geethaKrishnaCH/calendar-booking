import { useContext, useState } from "react";
import { Form, FormGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import useUserApi from "../../../../apis/useUserAPI";
import AppContext from "../../../context/AppContext";

export default function GuestVerificationModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [transactionId, setTransactionId] = useState(null);
  const navigate = useNavigate();
  const { generateOTP, verifyOTP } = useUserApi();
  const { setLogInState, showLoader, hideLoader } = useContext(AppContext);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const navigateToSignIn = () => {
    navigate("/login");
  };

  const handleGetOTP = async () => {
    try {
      showLoader();
      const { data } = (await generateOTP({ email: formData.email })).data;
      setTransactionId(data.transactionId);
    } catch {
    } finally {
      hideLoader();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      showLoader();
      const { data, success } = (
        await verifyOTP({ otp: formData.otp, transactionId })
      ).data;
      if (success) {
        setLogInState(data.accessToken);
        handleClose(true);
      } else {
        handleClose(false);
      }
    } catch (err) {
      handleClose(false);
    } finally {
      hideLoader();
    }
  };

  const emailEntered = !!formData.email;
  const otpEntered = !!formData.otp;
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Please Verify</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup controlId="email" className="mt-3">
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
            />
          </FormGroup>
          {transactionId && (
            <FormGroup controlId="otp" className="mt-3">
              <Form.Control
                name="otp"
                type="otp"
                value={formData.otp}
                placeholder="OTP"
                onChange={handleChange}
              />
            </FormGroup>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="align-items-start flex-column">
        {!transactionId && (
          <>
            <Button
              variant="primary"
              onClick={handleGetOTP}
              disabled={!emailEntered}
            >
              Get OTP
            </Button>
            <div>
              <span>Already a member?</span>
              <Button variant="link" onClick={navigateToSignIn}>
                Sign in!
              </Button>
            </div>
          </>
        )}
        {transactionId && (
          <Button
            variant="primary"
            onClick={handleVerifyOTP}
            disabled={!otpEntered}
          >
            Verify OTP
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
