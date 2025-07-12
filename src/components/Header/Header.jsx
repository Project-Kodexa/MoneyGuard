import React from "react";
import { useSelector } from "react-redux";
import s from "./Header.module.css";

const Header = () => {
  const userName = useSelector((state) => state.auth.user?.username || "Guest");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className={s.header}>
      <div className={s.logoContainer}>
        <img
          src="/money-guard.svg"
          alt="Money Guard Logo"
          className={s.logoImg}
        />
        <span className={s.logoText}>Money Guard</span>
      </div>
      <div className={s.user}>
        <span className={s.userName}>{userName}</span>
        <button onClick={handleLogout} className={s.exitBtn}>
          Exit
        </button>
      </div>
    </header>
  );
};

export default Header;
