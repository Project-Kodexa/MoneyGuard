import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./EditTransactionForm.module.css";
import { useDispatch } from "react-redux";
import { updateTransactionThunk } from '../../../redux/transactionsOperations';

// Yup validasyon şeması
const schema = yup.object().shape({
  type: yup.string().oneOf(["income", "expense"]).required(),
  sum: yup
    .number()
    .typeError("Enter a valid number")
    .positive("Must be positive")
    .required("Sum is required"),
  date: yup.date().required("Date is required"),
  category: yup.string().when("type", {
    is: "expense",
    then: (schema) => schema.required("Category is required"),
    otherwise: (schema) => schema.optional(),
  }),
  comment: yup.string().required("Comment is required"),
});

const EditTransactionForm = ({ transaction, onClose }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState(transaction?.type || "expense");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: transaction?.type || "expense",
      sum: transaction?.sum || "",
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      category: transaction?.category || "",
      comment: transaction?.comment || "",
    },
  });

  const onSubmit = (data) => {
    dispatch(updateTransactionThunk(transaction.id, data))
      .then(() => onClose())
      .catch((err) => {
        console.error('Update error:', err.message);
      });
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setValue("type", selectedType);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.editTransactionForm__container}
    >
      <h2 className={styles.editTransactionForm__title}>Edit transaction</h2>

      {/* Type Selector */}
      <div className={styles.editTransactionForm__typeToggle}>
        <span
          className={
            type === "income"
              ? styles.editTransactionForm__typeActive
              : styles.editTransactionForm__typeInactive
          }
          onClick={() => handleTypeChange("income")}
        >
          Income
        </span>
        <span className={styles.editTransactionForm__divider}> / </span>
        <span
          className={
            type === "expense"
              ? styles.editTransactionForm__typeActive
              : styles.editTransactionForm__typeInactive
          }
          onClick={() => handleTypeChange("expense")}
        >
          Expense
        </span>
      </div>

      {/* Category - sadece expense için */}
      {type === "expense" && (
        <div
          className={`${styles.editTransactionForm__formGroup} ${styles.categoryGroup}`}
        >
          <input
            type="text"
            placeholder="Category"
            className={styles.editTransactionForm__input}
            {...register("category")}
          />
          <p className={styles.editTransactionForm__errorMessage}>
            {errors.category?.message}
          </p>
        </div>
      )}

      {/* Sum ve Date yan yana */}
      <div
        className={`${styles.editTransactionForm__formGroup} ${styles.rowInputs}`}
      >
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          {...register("sum")}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, "");
          }}
          className={`${styles.editTransactionForm__input} ${styles.editTransactionForm__inputSum}`}
        />

        <DatePicker
          selected={watch("date")}
          onChange={(date) => setValue("date", date)}
          dateFormat="dd.MM.yyyy"
          className={`${styles.editTransactionForm__input} ${styles.editTransactionForm__inputDate}`}
        />
      </div>
      <p className={styles.editTransactionForm__errorMessage}>
        {errors.sum?.message || errors.date?.message}
      </p>

      {/* Comment */}
      <div
        className={`${styles.editTransactionForm__formGroup} ${styles.commentGroup}`}
      >
        <input
          type="text"
          placeholder="Comment"
          className={styles.editTransactionForm__input}
          {...register("comment")}
        />
        <p className={styles.editTransactionForm__errorMessage}>
          {errors.comment?.message}
        </p>
      </div>

      {/* Buttons */}
      <div className={styles.editTransactionForm__buttonGroup}>
        <button
          type="submit"
          className={styles.editTransactionForm__buttonSubmit}
        >
          SAVE
        </button>
        <button
          type="button"
          className={styles.editTransactionForm__buttonCancel}
          onClick={onClose}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
