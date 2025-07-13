import React from "react";
import styles from "./LoginPage.module.css";
import LoginForm from "../Login/LoginForm"; // 🔑 Asıl işlem burada olacak

const LoginPage = () => {
  return (
    <div className={styles.loginModal}>
      <div className={styles.login}>
        <div className={styles.loginLogo}>
          <img src="/moneyGuard.svg" alt="logo" />
          <p className={styles.loginTitle}>Money Guard</p>
        </div>

        <LoginForm /> {/* 👈 Kullanıcının giriş yaptığı bileşen */}
      </div>
    </div>
  );
};

export default LoginPage;
