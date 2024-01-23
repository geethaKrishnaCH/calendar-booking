import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
export default function Sidebar() {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/home");
  };
  return (
    <div className={`${styles.sidebar} bg-primary`}>
      <h1
        className="d-flex justify-content-center"
        role="button"
        onClick={navigateHome}
      >
        Ontime
      </h1>
    </div>
  );
}
