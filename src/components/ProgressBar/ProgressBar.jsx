import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ password, confirmPassword }) => {
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 30) return '#ff4444';
    if (strength < 60) return '#ffaa00';
    if (strength < 80) return '#88cc00';
    return '#00cc44';
  };

  const getStrengthText = (strength) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const strength = calculateStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ 
            width: `${strength}%`,
            backgroundColor: getStrengthColor(strength)
          }}
        />
      </div>
      <div className={styles.strengthInfo}>
        <span className={styles.strengthText}>
          Password strength: {getStrengthText(strength)}
        </span>
        {confirmPassword && (
          <span className={`${styles.matchText} ${passwordsMatch ? styles.match : styles.noMatch}`}>
            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar; 