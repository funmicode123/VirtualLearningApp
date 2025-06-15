import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../../../utils/yupSchemas';
import { signupThunk, googleAuthThunk } from '../../../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

import styles from './SignupForm.module.css';

const SignupForm = ({ onClose }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue('avatar', file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    const result = await dispatch(signupThunk(formData));
    if (signupThunk.fulfilled.match(result)) {
      onClose?.(); 
      navigate('/dashboard'); 
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleAuthThunk(credentialResponse.credential));
    if (googleAuthThunk.fulfilled.match(result)) {
      onClose?.();
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
  <div className={styles.formGroup}>
    <label className={styles.label}>Email</label>
    <input type="email" {...register('email')} className={styles.input} />
    <p className={styles.error}>{errors.email?.message}</p>
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Password</label>
    <input type="password" {...register('password')} className={styles.input} />
    <p className={styles.error}>{errors.password?.message}</p>
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Profile picture</label>
    <input type="file" accept="image/*" onChange={handleAvatarChange} className={styles.fileInput} />
    {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className={styles.avatarPreview} />}
  </div>

  <button type="submit" disabled={loading} className={styles.submitButton}>
    {loading ? 'Signing up...' : 'Sign Up'}
  </button>

  {error && <p className={styles.error}>{error}</p>}
</form>


      {/* <div className={styles.divider}>OR</div>

      <div className={styles.socialLogin}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error('Google Login Failed')} />
        <button className={styles.iconButton}>
          <FcGoogle className={styles.icon} />
          Sign up with Google
        </button>
      </div> */}
    </div>
  );
};

export default SignupForm;
