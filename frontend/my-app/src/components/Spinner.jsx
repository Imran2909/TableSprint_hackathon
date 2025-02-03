import React from "react";
import styles from "./styles/spinner.module.css";
import { useSelector } from "react-redux";

const Spinner = ({text}) => {
  const isLoading = useSelector((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
};

export default Spinner;

