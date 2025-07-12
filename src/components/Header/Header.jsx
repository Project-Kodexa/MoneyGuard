import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutThunk } from '../../features/auth/authOperations';
import s from './Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(state => state.auth.user?.name || 'Guest');
  const isLoading = useSelector(state => state.auth.isLoading);
  const user = useSelector(state => state.auth.user);

  // Debug için kullanıcı bilgilerini kontrol et
  console.log('Header - Auth state:', useSelector(state => state.auth));
  console.log('Header - User object:', user);
  console.log('Header - User name:', userName);

  const handleLogout = async () => {
    try {
      // Redux logout thunk'ını çağır
      await dispatch(logoutThunk()).unwrap();
      
      // Başarılı çıkış sonrası login sayfasına yönlendir
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Hata olsa bile local state'i temizle
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <header className={s.header}>
      <div className={s.logoContainer}>
        <img src="/money-guard.svg" alt="Money Guard Logo" className={s.logoImg} />
        <span className={s.logoText}>Money Guard</span>
      </div>
      <div className={s.user}>
        <span className={s.userName}>{userName}</span>
        <button 
          onClick={handleLogout} 
          className={s.exitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Exiting...' : 'Exit'}
        </button>
      </div>
    </header>
  );
};

export default Header;
