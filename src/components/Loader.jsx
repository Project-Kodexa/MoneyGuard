import styles from './Loader.module.css'; // Adjust the path as necessary


export default function Loader() {
    console.log("Loader component rendered");
    return (
        <div className={styles.overlay}>
      <div className={styles['bar-wave']}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>
    </div>
    );
   
    }