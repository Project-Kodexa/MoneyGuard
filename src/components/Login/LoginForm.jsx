import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../features/auth/authOperations";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import styles from "./LoginPage.module.css";

// Validasyon kuralları
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("E-mail is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoginError(null);

    const result = await dispatch(loginThunk(data));

    if (loginThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    } else {
      setLoginError("Email or password is incorrect.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.loginInputGroup}>
        <FaEnvelope className={styles.loginIcon} />
        <input
          {...register("email")}
          type="email"
          placeholder="E-mail"
          className={styles.loginInput}
        />
      </div>
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <div className={styles.loginInputGroup}>
        <FaLock className={styles.loginIcon} />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className={styles.loginInput}
        />
      </div>
      {errors.password && (
        <p className={styles.error}>{errors.password.message}</p>
      )}

      {loginError && <p className={styles.error}>{loginError}</p>}
      <div className={styles.loginBtnContainer}>
        <button type="submit" className={styles.loginBtn}>
          LOG IN
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className={styles.registerBtn}
        >
          REGISTER
        </button>
      </div>
    </form>
  );
}
