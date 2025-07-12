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
      const { username, confirmPassword, ...rest } = data;
      const payload = { name: username, ...rest };

      console.log("📤 Kayıt için gönderilen payload:", payload);

      const result = await dispatch(registerThunk(payload));

      if (registerThunk.fulfilled.match(result)) {
        const userToSave = result.payload;

        // ✅ Token'ı hem Axios'a ekle hem localStorage'a kaydet
        setAuthToken(userToSave.token);
        localStorage.setItem("token", userToSave.token);

        // ✅ Redux store'a kullanıcıyı kaydet
        dispatch(setCredentials(userToSave));

        console.log("✅ Kayıt başarılı ve Redux güncellendi!", userToSave);
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");

        reset(); // yönlendirme öncesi formu temizle
        navigate("/login");
      } else {
        console.error("❌ Kayıt başarısız oldu:", result.error);
        alert("Kayıt başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("❌ Kayıt işlemi sırasında bir hata oluştu:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
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
        type="email"
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
        <p className={styles.errorMessage}>
          {errors.confirmPassword.message}
        </p>
      )}

      <button type="submit" className={styles.button_reg}>
        Register
      </button>
    </form>
  );
}