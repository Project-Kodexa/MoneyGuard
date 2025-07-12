import React from "react";
import RegistrationForm from "../auth/RegistrationForm.jsx";
import styles from "./RegistrationPage.module.css";

function RegistrationPage() {
  return (
    <div className={styles.pageContainer}>
      <img src="/moneyGuard.svg" alt="logo" />
      <h1 className={styles.title}>Money Guard</h1>
      <RegistrationForm />
    </div>
  );
}

export default RegistrationPage;
