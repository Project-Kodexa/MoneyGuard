import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutThunk } from '../../features/auth/authOperations';
import { logout } from '../../features/auth/authSlice';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      localStorage.clear();
      navigate('/login');
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {/* Logo ve başlık */}
        <div className={styles.logoSection}>
          <img
            src="/moneyGuard.svg" 
            alt="Money Guard Logo"
            className={styles.logoImg}
          />
          <h3 className={styles.logoTitle}>Money Guard</h3>
        </div>

        {/* Soru metni */}
        <p className={styles.questionText}>
          Are you sure you want to log out?
        </p>

        {/* Butonlar */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            type="button"
          >
            LOGOUT
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            type="button"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;