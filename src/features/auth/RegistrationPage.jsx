import React from 'react';

import { Link } from 'react-router-dom';
import RegistrationForm from '../../components/Forms/RegistrationForm';
import styles from './RegistrationPage.module.css'; 

function RegistrationPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Register Account</h1>
      <RegistrationForm /> {RegistrationForm}
      <p className={styles.loginText}>
        Already have an account?
        <Link to="/login" className={styles.loginLink}>
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegistrationPage;