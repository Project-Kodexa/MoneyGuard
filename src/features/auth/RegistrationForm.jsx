import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../schemas/registerSchema";
import styles from "./RegistrationForm.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../services/api";
import { registerThunk } from "../../features/auth/authOperations";
import { setCredentials } from "../auth/authSlice";
import { FaUser, FaEnvelope, FaLock, FaCheckDouble } from "react-icons/fa"; // 🔥 İkonlar

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

      const result = await dispatch(registerThunk(payload));

      if (registerThunk.fulfilled.match(result)) {
        const userToSave = result.payload;
        setAuthToken(userToSave.token);
        localStorage.setItem("token", userToSave.token);
        dispatch(setCredentials(userToSave));
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        reset();
        navigate("/login");
      } else {
        alert("Kayıt başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inputGroup}>
        <FaUser className={styles.icon} />
        <input
          className={styles.input}
          {...register("username")}
          placeholder="Name"
        />
      </div>
      {errors.username && (
        <p className={styles.errorMessage}>{errors.username.message}</p>
      )}

      <div className={styles.inputGroup}>
        <FaEnvelope className={styles.icon} />
        <input
          type="email"
          className={styles.input}
          {...register("email")}
          placeholder="E-mail"
        />
      </div>
      {errors.email && (
        <p className={styles.errorMessage}>{errors.email.message}</p>
      )}

      <div className={styles.inputGroup}>
        <FaLock className={styles.icon} />
        <input
          type="password"
          className={styles.input}
          {...register("password")}
          placeholder="Password"
        />
      </div>
      {errors.password && (
        <p className={styles.errorMessage}>{errors.password.message}</p>
      )}

      <div className={styles.inputGroup}>
        <FaLock className={styles.icon} />
        <input
          type="password"
          className={styles.input}
          {...register("confirmPassword")}
          placeholder="Confirm Password"
        />
      </div>
      {errors.confirmPassword && (
        <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>
      )}

      <button type="submit" className={styles.button_reg}>
        Register
      </button>

      <button
        type="button"
        className={styles.button_log}
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </form>
  );
}
