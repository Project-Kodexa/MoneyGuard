import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddTransactionForm.module.css";
import { addTransactionThunk } from "../../../redux/transactionsOperations";
import categories from "../modalCategory"; 

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
    // Kalıcı log için localStorage kullan
    localStorage.setItem('debug_form_submit', 'true');
    localStorage.setItem('debug_form_data', JSON.stringify(data));
    
    console.log('=== FORM SUBMIT BAŞLADI ==='); // DEBUG
    console.log('Formdan gelen ham veri:', data); // DEBUG
    
    try {
      // Form verilerini API formatına dönüştür
      const transactionData = {
        ...data,
        amount: parseFloat(data.sum), // sum -> amount
        date: data.date.toISOString(), // Date objesini ISO string'e dönüştür
        sum: undefined // sum alanını kaldır
      };
      
      localStorage.setItem('debug_transaction_data', JSON.stringify(transactionData));
      
      console.log('Formdan gönderilen veri:', data); // DEBUG
      console.log('API\'ye gönderilen veri:', transactionData); // DEBUG
      
            console.log('addTransactionThunk dispatch ediliyor...'); // DEBUG
      dispatch(addTransactionThunk(transactionData))
        .then((res) => {
          console.log('=== ADD TRANSACTION BAŞARILI ==='); // DEBUG
          console.log('addTransactionThunk response:', res); // DEBUG
          console.log('addTransactionThunk response payload:', res.payload); // DEBUG
          localStorage.setItem('debug_success', JSON.stringify(res));
          onClose();
        })
        .catch((err) => {
          console.log('=== ADD TRANSACTION HATASI ==='); // DEBUG
          console.log('addTransactionThunk error:', err); // DEBUG
          localStorage.setItem('debug_error', JSON.stringify(err));
          alert("Transaction eklenirken hata oluştu: " + err.message);
        });
    } catch (error) {
      console.log('=== FORM SUBMIT HATASI ==='); // DEBUG
      console.log('Form submit error:', error); // DEBUG
      localStorage.setItem('debug_form_error', JSON.stringify(error));
      alert("Form gönderilirken hata oluştu: " + error.message);
    }
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setValue("type", selectedType);
    if (selectedType === "income") {
      setValue("category", "");
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.addTransactionForm__container}
      noValidate
    >
      <h2 className={styles.addTransactionForm__title}>Add transaction</h2>

      <div className={styles.addTransactionForm__typeToggle}>
        <div
          className={`${styles.addTransactionForm__typeToggleText} ${
            type === "income" ? styles.active : styles.inactive
          }`}
          onClick={() => handleTypeChange("income")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleTypeChange("income");
            }
          }}
        >
          Income
        </div>

        <div
          className={styles.addTransactionForm__switchTrack}
          onClick={() => handleTypeChange(type === "income" ? "expense" : "income")}
          role="switch"
          aria-checked={type === "income"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleTypeChange(type === "income" ? "expense" : "income");
            }
          }}
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
            type === "expense" ? styles.active : styles.inactive
          }`}
          onClick={() => handleTypeChange("expense")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleTypeChange("expense");
            }
          }}
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
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <p className={styles.addTransactionForm__errorMessage}>
            {errors.category?.message}
          </p>
        </div>
      )}

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
