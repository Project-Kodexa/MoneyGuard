import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../schemas/registerSchema';
import './RegistrationForm.module.css';


function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Kullanıcı Adı" />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} placeholder="E-posta" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} placeholder="Parola" />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('passwordConfirm')} placeholder="Parola Tekrar" />
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}

      <button type="submit">Kaydol</button>
    </form>
  );
}

export default RegistrationForm;