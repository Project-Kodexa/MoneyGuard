import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logoutThunk } from '../../features/auth/authOperations';
import { IoExitOutline } from "react-icons/io5";
import s from "./Header.module.css";

import LogoutModal from "../LogoutModal/LogoutModal"; // 👈 Modal bileşeni

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(state => state.auth.user?.name || 'Guest');
  const isLoading = useSelector(state => state.auth.isLoading);

  // 👇 Modal kontrolü için state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <>
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
          <button 
            onClick={() => setIsModalOpen(true)} // 👈 Exit butonuna basıldığında modal aç
            className={s.exitBtn}
            disabled={isLoading}
          >
            <IoExitOutline />
            {isLoading ? 'Exiting...' : 'Exit'}
          </button>
        </div>
      </header>

     
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;