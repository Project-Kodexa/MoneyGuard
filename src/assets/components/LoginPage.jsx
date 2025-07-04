import React from "react";
import styles from "./LoginPage.module.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className={styles.loginModal}>
      <div className={styles.login}>
        <div className={styles.loginLogo}>
          <img src="../img/loginImg.png" alt="logo" />
          <h2>Money Guard</h2>
        </div>
        <div className={styles.loginInputGroup}>
          <FaEnvelope className={styles.loginIcon} />
          <input
            type="email"
            placeholder="Email"
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
        <button className={styles.loginBtn}>Log In</button>
        <button className={styles.registerBtn}>Register</button>
      </div>
    </div>
  );
};

export default LoginPage;
