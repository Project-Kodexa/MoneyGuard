import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../schemas/registerSchema';
import styles from './RegistrationForm.module.css'; // Stil dosyasını import etmeyi unutmayın
import { useDispatch } from 'react-redux'; // Sadece useDispatch yeterli
import { useNavigate } from 'react-router-dom'; // useNavigate import et



function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset // Formu temizlemek için reset fonksiyonunu ekle
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => {
    // Backend olmadığı için confirmPassword'ı ayırmaya gerek yok,

    console.log("Kayıt başarılı!", data);
    alert('Kayıt başarılı!'); // Kullanıcıya geri bildirim

    // Kayıt başarılıysa kullanıcıyı Anasayfaya yönlendir
    navigate('/login');
    reset();
  };

  return (
    // Form elemanlarına CSS modüllerini uygulayın
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input
        className={styles.input}
        {...register('username')}
        placeholder="Kullanıcı Adı"
      />
      {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}

      <input
        className={styles.input}
        {...register('email')}
        placeholder="E-posta"
      />
      {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}

      <input
        type="password"
        className={styles.input}
        {...register('password')}
        placeholder="Parola"
      />
      {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}

      <input
        type="password"
        className={styles.input}
        {...register('confirmPassword')}
        placeholder="Parola Tekrar"
      />
      {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>}

      <button type="submit" className={styles.button_reg}>
        Kaydol
      </button>

      {/* Backend olmadığı için isLoading ve error state'lerine burada doğrudan ihtiyaç yok */}
    </form>
  );
}

export default RegistrationForm;