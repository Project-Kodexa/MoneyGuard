import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './AddTransactionForm.module.css';
import { addTransactionThunk } from '../../../redux/transactionsOperations';

// Yup şeması
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

const AddTransactionForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState('expense');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      sum: '',
      date: new Date(),
      category: '',
      comment: '',
    },
  });

  const onSubmit = (data) => {
    dispatch(addTransactionThunk(data))
      .unwrap()
      .then(() => onClose())
      .catch(err => alert('Transaction eklenirken hata oluştu: ' + err));
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setValue('type', selectedType);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addTransactionForm__container}>
      <h2 className={styles.addTransactionForm__title}>Add transaction</h2>

      <div className={styles.addTransactionForm__typeToggle}>
        <button
          type="button"
          className={`${styles.addTransactionForm__typeToggleButton} ${type === 'income' ? styles.addTransactionForm__typeToggleButtonActive : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </button>
        <button
          type="button"
          className={`${styles.addTransactionForm__typeToggleButton} ${type === 'expense' ? styles.addTransactionForm__typeToggleButtonActive : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </button>
      </div>

      {type === 'expense' && (
        <div className={styles.addTransactionForm__formGroup}>
          <select className={styles.addTransactionForm__select} {...register('category')}>
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
          </select>
          <p className={styles.addTransactionForm__errorMessage}>{errors.category?.message}</p>
        </div>
      )}

      <div className={styles.addTransactionForm__formGroup}>
        <input
          type="number"
          placeholder="0.00"
          step="0.01"
          className={styles.addTransactionForm__input}
          {...register('sum')}
        />
        <p className={styles.addTransactionForm__errorMessage}>{errors.sum?.message}</p>
      </div>

      <div className={`${styles.addTransactionForm__formGroup} ${styles.addTransactionForm__datePickerWrapper}`}>
        <DatePicker
          selected={watch('date')}
          onChange={(date) => setValue('date', date)}
          dateFormat="dd.MM.yyyy"
          className={styles.addTransactionForm__input}
        />
        <p className={styles.addTransactionForm__errorMessage}>{errors.date?.message}</p>
      </div>

      <div className={styles.addTransactionForm__formGroup}>
        <input
          type="text"
          placeholder="Comment"
          className={styles.addTransactionForm__input}
          {...register('comment')}
        />
        <p className={styles.addTransactionForm__errorMessage}>{errors.comment?.message}</p>
      </div>

      <div className={styles.addTransactionForm__buttonGroup}>
        <button type="submit" className={styles.addTransactionForm__buttonSubmit}>
          Add
        </button>
        <button type="button" className={styles.addTransactionForm__buttonCancel} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
