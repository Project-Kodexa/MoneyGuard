import * as yup from 'yup';


export const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(7, 'Password must be at least 7 characters').max(30, 'Password must be at most 30 characters').required('Password is required'),
});

// Kişi 3 login işlemi için bu şemayı kullanabilir :)