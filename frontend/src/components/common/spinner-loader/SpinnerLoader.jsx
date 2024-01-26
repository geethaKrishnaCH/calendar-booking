import Spinner from "react-bootstrap/Spinner";
import styles from "./SpinnerLoader.module.css";
export default function SpinnerLoader() {
  return (
    <div className={styles.container}>
      <Spinner className={styles.loader} size="lg" animation="border" />
    </div>
  );
}
