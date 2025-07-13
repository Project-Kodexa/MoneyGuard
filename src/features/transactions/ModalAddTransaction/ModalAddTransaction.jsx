import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";
import styles from "./ModalAddTransaction.module.css";

const ModalAddTransaction = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.modalAddTransaction__overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modalAddTransaction__content}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.modalAddTransaction__closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <AddTransactionForm onClose={onClose} />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ModalAddTransaction;
