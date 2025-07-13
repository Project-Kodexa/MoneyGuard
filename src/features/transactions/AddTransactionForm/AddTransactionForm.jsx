import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddTransactionForm.module.css";
import { addTransactionThunk } from "../../../redux/transactionsOperations";

import calendarIcon from "../../../images/addTrn/calenderIcon.png";

// Validasyon şeması
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

  const { categories } = useSelector((state) => state.transactions);

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
    try {
      const formattedDate = data.date.toISOString().split("T")[0];
      let categoryId = data.category;

      if (data.type === "income") {
        const incomeCategories = categories.filter(
          (cat) => cat.type === "INCOME"
        );
        categoryId =
          incomeCategories[0]?.id || "00000000-0000-0000-0000-000000000001";
      }

      const transactionData = {
        amount: parseFloat(data.sum),
        transactionDate: formattedDate,
        type: data.type === "income" ? "INCOME" : "EXPENSE",
        categoryId,
        comment: data.comment,
      };

      dispatch(addTransactionThunk(transactionData))
        .then(() => onClose())
        .catch((err) => console.error("Add transaction error:", err.message));
    } catch (error) {
      console.error("Form submit error:", error.message);
    }
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setValue("type", selectedType);
    if (selectedType === "income") setValue("category", "");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.addTransactionForm__container}
      noValidate
    >
      <h2 className={styles.addTransactionForm__title}>Add transaction</h2>

      {/* Toggle */}
      <div className={styles.addTransactionForm__typeToggle}>
        <div
          className={`${styles.addTransactionForm__typeToggleText} ${
            type === "income" ? styles.active : ""
          }`}
          onClick={() => handleTypeChange("income")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleTypeChange("income")
          }
        >
          Income
        </div>

        <div
          className={styles.addTransactionForm__switchTrackk}
          onClick={() =>
            handleTypeChange(type === "income" ? "expense" : "income")
          }
          role="switch"
          aria-checked={type === "income"}
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            handleTypeChange(type === "income" ? "expense" : "income")
          }
        >
          <div
            className={`${styles.addTransactionForm__switchThumb} ${
              type === "expense" ? styles.expense : ""
            }`}
          >
            {type === "income" ? "+" : "−"}
          </div>
        </div>

        <div
          className={`${styles.addTransactionForm__typeToggleText} ${
            type === "expense" ? styles.active : ""
          }`}
          onClick={() => handleTypeChange("expense")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleTypeChange("expense")
          }
        >
          Expense
        </div>
      </div>

      {type === "expense" && (
        <div className={styles.addTransactionForm__formGroup}>
          <select
            className={styles.addTransactionForm__select}
            {...register("category")}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className={styles.addTransactionForm__errorMessage}>
            {errors.category?.message}
          </p>
        </div>
      )}

      {/* Amount + Date */}
      <div className={styles.addTransactionForm__rowInputs}>
        <input
          type="text"
          placeholder="0.00"
          className={styles.addTransactionForm__input}
          {...register("sum")}
          onInput={(e) =>
            (e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
          }
        />

        <div className={styles.datepickerWrapper}>
          <DatePicker
            selected={watch("date")}
            onChange={(date) => setValue("date", date)}
            dateFormat="dd.MM.yyyy"
            className={`${styles.addTransactionForm__input} ${styles.datepickerInput}`}
          />
          <img
            src={calendarIcon}
            alt="calendar icon"
            className={styles.datepickerIcon}
          />
        </div>
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
