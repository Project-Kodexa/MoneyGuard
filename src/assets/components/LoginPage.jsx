import React from "react";
import styles from "./LoginPage.module.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className={styles.loginModal}>
      <div className={styles.login}>
        <div className={styles.loginLogo}>
          <img src="../../../public/moneyGuard.svg" alt="logo" />
          <p className={styles.loginTitle}>Money Guard</p>
        </div>
        <div className={styles.loginInputGroup}>
          <FaEnvelope className={styles.loginIcon} />
          <input
            type="email"
            placeholder="E-mail"
            className={styles.loginInput}
          />
        </div>
        <div className={styles.loginInputGroup}>
          <FaLock className={styles.loginIcon} />
          <input
            type="password"
            placeholder="Password"
            className={styles.loginInput}
          />
        </div>
        <button className={styles.loginBtn}>LOG IN</button>
        <button className={styles.registerBtn}>REGİSTER</button>
      </div>
    </div>
  );
};

export default LoginPage;
