import React from "react";
import styles from "./LoginPage.module.css";
import LoginForm from "./LoginForm"; // 👈 formu çağırıyoruz

const LoginPage = () => {
  return (
    <div className={styles.loginModal}>
      <div className={styles.login}>
        <div className={styles.loginLogo}>
          <img src="/moneyGuard.svg" alt="logo" />
          <p className={styles.loginTitle}>Money Guard</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
