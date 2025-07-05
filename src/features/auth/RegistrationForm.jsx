import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../schemas/registerSchema';
import styles from './RegistrationForm.module.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice'; 

function RegistrationForm() {
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

  const onSubmit = (data) => {
    // Form verilerini al ve confirmPassword hariç diğerlerini kullan
    const { confirmPassword, ...userData } = data;

    // Backend olmadığı için mockToken kullandım
    const userToSave = {
      token: `mock_token_${Date.now()}`,
      user: {
        name: userData.username,
        email: userData.email,
        balance: 0, // Başlangıçta 0 bakiye
      },
    };
    // Redux store'a kullanıcı bilgilerini kaydet
    dispatch(setCredentials(userToSave));

    console.log("Kayıt başarılı ve Redux güncellendi!", userToSave);
    alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');

    // Kayıt başarılıysa kullanıcıyı Giriş sayfasına yönlendir
    navigate('/login');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input
        className={styles.input}
        {...register('username')}
        placeholder="Username"
      />
      {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}

      <input
        className={styles.input}
        {...register('email')}
        placeholder="E-mail"
      />
      {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}

      <input
        type="password"
        className={styles.input}
        {...register('password')}
        placeholder="Password"
      />
      {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}

      <input
        type="password"
        className={styles.input}
        {...register('confirmPassword')}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>}

      <button type="submit" className={styles.button_reg}>
        Register
      </button>
    </form>
  );
}

export default RegistrationForm;