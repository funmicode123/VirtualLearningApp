import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../utils/yupSchemas";
import { loginThunk, googleAuthThunk } from "../../../store/slices/authSlice";
// import { GoogleLogin } from "@react-oauth/google";
// import { FcGoogle } from "react-icons/fc";

import styles from "./SignupForm.module.css";
import { toast } from "react-toastify";

const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const formData = {
        email: data.email,
        password: data.password,
    };


    const result = await dispatch(loginThunk(formData));
    if (loginThunk.fulfilled.match(result)) {
          toast.success("🎉 Login successful! Redirecting...", {
            position: "top-right",
            theme: "colored",
            icon: "✅",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
    
          setIsRedirecting(true);
          setTimeout(() => {
            setIsRedirecting(false);
            onClose?.();
            navigate("/createSession");
          }, 2000);
        } else {
          toast.error(result.payload || "Login failed. Please try again.");
        }
    };
    

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(
      googleAuthThunk(credentialResponse.credential)
    );
    if (googleAuthThunk.fulfilled.match(result)) {
      onClose?.();
      navigate("/");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input type="email" {...register("email")} className={styles.input} />
          <p className={styles.error}>{errors.email?.message}</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            {...register("password")}
            className={styles.input}
          />
          <p className={styles.error}>{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading || isRedirecting ? "Processing..." : "Login"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      {/* <div className={styles.divider}>OR</div>

      <div className={styles.socialLogin}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error('Google Login Failed')} />
        <button className={styles.iconButton}>
          <FcGoogle className={styles.icon} />
          Login with Google
        </button>
      </div> */}
    </div>
  );
};

export default LoginForm;
