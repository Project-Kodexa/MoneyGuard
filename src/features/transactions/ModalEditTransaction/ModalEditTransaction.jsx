import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import EditTransactionForm from '../EditTransactionForm/EditTransactionForm';
import Styles from './ModalEditTransaction.module.css';

const modalRoot = document.getElementById('modal-root');

function ModalEditTransaction({ transaction, onClose }) {
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  function handleOverlayClick() {
    onClose();
  }

  function handleContentClick(e) {
    e.stopPropagation();
  }

  return ReactDOM.createPortal(
    <div
      className={Styles.modalEditTransaction__overlay}
      onClick={handleOverlayClick}
    >
      <div
         className={Styles.modalEditTransaction__content}
        onClick={handleContentClick}
      >
        <h2 className={Styles.modalEditTransaction__title}>Edit transaction</h2>

        
        <EditTransactionForm transaction={transaction} onClose={onClose} />

        <button
          className={Styles.modalEditTransaction__closeBtn}
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>
    </div>,
    modalRoot
  );
}

export default ModalEditTransaction;
