import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').max(30).required('Password is required'),
  profilePic: yup.mixed().notRequired(),
});
