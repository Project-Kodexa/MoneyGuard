import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddTransactionForm.module.css";
 import { addTransactionThunk } from '../../../redux/transactionsOperations';
// Yup validation schema
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

const AddTransactionForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("expense");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "expense",
      sum: "",
      date: new Date(),
      category: "",
      comment: "",
    },
  });

  const onSubmit = (data) => {
    // Eğer addTransaction imported ise kullanılır
    dispatch(addTransactionThunk(data))
      .then(() => onClose())
      .catch((err) =>
        alert("Transaction eklenirken hata oluştu: " + err.message)
      );
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setValue("type", selectedType);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.addTransactionForm__container}
      noValidate
    >
      <h2 className={styles.addTransactionForm__title}>Add transaction</h2>

      {/* Type selector */}
      <div className={styles.addTransactionForm__typeToggle}>
        <button
          type="button"
          className={`${styles.addTransactionForm__typeToggleButton} ${
            type === "income"
              ? styles.addTransactionForm__typeToggleButtonActive
              : ""
          }`}
          onClick={() => handleTypeChange("income")}
        >
          Income
        </button>
        <button
          type="button"
          className={`${styles.addTransactionForm__typeToggleButton} ${
            type === "expense"
              ? styles.addTransactionForm__typeToggleButtonActive
              : ""
          }`}
          onClick={() => handleTypeChange("expense")}
        >
          Expense
        </button>
      </div>

      {/* Category - only for expense */}
      {type === "expense" && (
        <div className={styles.addTransactionForm__formGroup}>
          <select
            className={styles.addTransactionForm__select}
            {...register("category")}
          >
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            {/* Backend’den gelecek kategori seçenekleri buraya eklenebilir */}
          </select>
          <p className={styles.addTransactionForm__errorMessage}>
            {errors.category?.message}
          </p>
        </div>
      )}

      {/* Sum ve Date yan yana */}
      <div className={styles.addTransactionForm__rowInputs}>
        <input
          type="text"
          placeholder="0.00"
          className={styles.addTransactionForm__input}
          {...register("sum")}
          onInput={(e) => {
            // Sadece rakam ve nokta izin ver, diğerlerini sil
            e.target.value = e.target.value.replace(/[^0-9.]/g, "");
          }}
        />
        <DatePicker
          selected={watch("date")}
          onChange={(date) => setValue("date", date)}
          dateFormat="dd.MM.yyyy"
          className={styles.addTransactionForm__input}
        />
      </div>
      <p className={styles.addTransactionForm__errorMessage}>
        {errors.sum?.message}
      </p>
      <p className={styles.addTransactionForm__errorMessage}>
        {errors.date?.message}
      </p>

      {/* Comment */}
      <div className={styles.addTransactionForm__formGroup}>
        <input
          type="text"
          placeholder="Comment"
          className={styles.addTransactionForm__input}
          {...register("comment")}
        />
        <p className={styles.addTransactionForm__errorMessage}>
          {errors.comment?.message}
        </p>
      </div>

      {/* Buttons */}
      <div className={styles.addTransactionForm__buttonGroup}>
        <button
          type="submit"
          className={styles.addTransactionForm__buttonSubmit}
        >
          ADD
        </button>
        <button
          type="button"
          className={styles.addTransactionForm__buttonCancel}
          onClick={onClose}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
