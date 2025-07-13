import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutThunk } from '../../features/auth/authOperations';
import { logout } from '../../features/auth/authSlice';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Backend'e logout isteği gönder
      await dispatch(logoutThunk()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Her durumda kullanıcıyı çıkış yap
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

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div className={styles.content}>
          <h2 className={styles.title}>Are you sure?</h2>
          <p className={styles.message}>
            Do you really want to log out from your account?
          </p>
          
          <div className={styles.buttonGroup}>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
              type="button"
            >
              Log Out
            </button>
            <button 
              className={styles.cancelButton}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 