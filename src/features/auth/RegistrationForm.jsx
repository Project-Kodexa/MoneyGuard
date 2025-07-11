import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../schemas/registerSchema";
import styles from "./RegistrationForm.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../services/api";
import { registerThunk } from "../../features/auth/authOperations";
import { setCredentials } from "../auth/authSlice";

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

 const onSubmit = async (data) => {
  try {
    const { username, ...rest } = data;
    const payload = { name: username, ...rest };

    console.log("Kayıt için gönderilen payload:", payload); // Kontrol amaçlı
    const result = await dispatch(registerThunk(payload));

    console.log("Thunk sonucu:", result);

    if (registerThunk.fulfilled.match(result)) {
      const token = result.payload.token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      dispatch(setCredentials(result.payload));
      alert("Kayıt başarılı!");
      navigate("/login");
      reset();
    } else {
      alert(result.payload || "Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  } catch (err) {
    console.error("Kayıt sırasında hata:", err);
    alert("Bir hata oluştu.");
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input
        className={styles.input}
        {...register("username")}
        placeholder="Username"
      />
      {errors.username && (
        <p className={styles.errorMessage}>{errors.username.message}</p>
      )}

      <input
        className={styles.input}
        {...register("email")}
        placeholder="E-mail"
      />
      {errors.email && (
        <p className={styles.errorMessage}>{errors.email.message}</p>
      )}

      <input
        type="password"
        className={styles.input}
        {...register("password")}
        placeholder="Password"
      />
      {errors.password && (
        <p className={styles.errorMessage}>{errors.password.message}</p>
      )}

      <input
        type="password"
        className={styles.input}
        {...register("confirmPassword")}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && (
        <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>
      )}

      <button type="submit" className={styles.button_reg}>
        Register
      </button>
    </form>
  );
}
