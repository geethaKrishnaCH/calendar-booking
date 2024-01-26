import { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";
import styles from "./ToastMessage.module.css";
export default function ToastMessage({
  message,
  onClose,
  show,
  error = false,
}) {
  const [showToast, setShowToast] = useState(show);
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 3000);
    }
  }, [showToast, onClose]);
  return (
    <Toast
      onClose={onClose}
      show={show}
      autohide={true}
      bg={error ? "danger" : "success"}
      className={styles["toast-container"]}
    >
      <Toast.Header>
        <strong className="me-auto">{error ? "Error" : "Success"}</strong>
      </Toast.Header>
      <Toast.Body className="text-white">{message}</Toast.Body>
    </Toast>
  );
}
