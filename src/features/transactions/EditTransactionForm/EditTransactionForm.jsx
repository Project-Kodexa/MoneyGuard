import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './EditTransactionForm.module.css';
import { useDispatch } from 'react-redux';
import { updateTransactionThunk } from '../../../redux/transactionsOperations';

const schema = yup.object().shape({
  type: yup.string().oneOf(['income', 'expense']).required(),
  sum: yup.number().typeError('Enter a valid number').positive('Must be positive').required('Sum is required'),
  date: yup.date().required('Date is required'),
  category: yup.string().when('type', {
    is: 'expense',
    then: schema => schema.required('Category is required'),
    otherwise: schema => schema.optional(),
  }),
  comment: yup.string().required('Comment is required'),
});

const EditTransactionForm = ({ transaction, onClose }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState(transaction?.type || 'expense');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: transaction?.type || 'expense',
      sum: transaction?.sum || '',
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      category: transaction?.category || '',
      comment: transaction?.comment || '',
    },
  });

  const onSubmit = (data) => {
    dispatch(updateTransactionThunk({ id: transaction.id, transactionData: data }))
      .unwrap()
      .then(() => onClose())
      .catch((err) => alert('Güncelleme sırasında bir hata oluştu: ' + err));
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setValue('type', selectedType);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.editTransactionForm__container}>
      <h2 className={styles.editTransactionForm__title}>Edit transaction</h2>

      <div className={styles.editTransactionForm__typeToggle}>
        <span
          className={type === 'income' ? styles.editTransactionForm__typeActive : styles.editTransactionForm__typeInactive}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </span>
        <span className={styles.editTransactionForm__divider}> / </span>
        <span
          className={type === 'expense' ? styles.editTransactionForm__typeActive : styles.editTransactionForm__typeInactive}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </span>
      </div>

      {type === 'expense' && (
        <div className={styles.editTransactionForm__formGroup}>
          <select className={styles.editTransactionForm__select} {...register('category')}>
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
          </select>
          <p className={styles.editTransactionForm__errorMessage}>{errors.category?.message}</p>
        </div>
      )}

      <div className={styles.editTransactionForm__formGroup}>
        <input
          type="number"
          placeholder="0.00"
          step="0.01"
          className={styles.editTransactionForm__input}
          {...register('sum')}
        />
        <p className={styles.editTransactionForm__errorMessage}>{errors.sum?.message}</p>
      </div>

      <div className={`${styles.editTransactionForm__formGroup} ${styles.editTransactionForm__datePickerWrapper}`}>
        <DatePicker
          selected={watch('date')}
          onChange={(date) => setValue('date', date)}
          dateFormat="dd.MM.yyyy"
          className={styles.editTransactionForm__input}
        />
        <p className={styles.editTransactionForm__errorMessage}>{errors.date?.message}</p>
      </div>

      <div className={styles.editTransactionForm__formGroup}>
        <input
          type="text"
          placeholder="Comment"
          className={styles.editTransactionForm__input}
          {...register('comment')}
        />
        <p className={styles.editTransactionForm__errorMessage}>{errors.comment?.message}</p>
      </div>

      <div className={styles.editTransactionForm__buttonGroup}>
        <button type="submit" className={styles.editTransactionForm__buttonSubmit}>
          Save
        </button>
        <button type="button" className={styles.editTransactionForm__buttonCancel} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
