import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../../utils/yupSchemas";
import { signupThunk, googleAuthThunk } from "../../../store/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

import styles from "./SignupForm.module.css";
import { toast } from "react-toastify";

const SignupForm = ({ onClose }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
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
      setValue("profilePic", file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profilePic) {
      formData.append("profilePic", data.profilePic);
    }

    const result = await dispatch(signupThunk(formData));
    if (signupThunk.fulfilled.match(result)) {
      toast.success("🎉 Signup successful! Redirecting...", {
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
      }, 3000);
    } else {
      toast.error(result.payload || "Signup failed. Please try again.");
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

        <div className={styles.formGroup}>
          <label className={styles.label}>Profile picture</label>
          <input
            type="file"
            accept="image/*"
            {...register("profilePic")}
            onChange={handleAvatarChange}
            className={styles.fileInput}
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className={styles.avatarPreview}
            />
          )}
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading || isRedirecting}
        >
          {loading || isRedirecting ? "Processing..." : "Sign Up"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      {/* Future: Enable Google Signup */}
      {/* <div className={styles.divider}>OR</div>
      <div className={styles.socialLogin}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.error("Google Login Failed")}
        />
        <button className={styles.iconButton}>
          <FcGoogle className={styles.icon} />
          Sign up with Google
        </button>
      </div> */}
    </div>
  );
};

export default SignupForm;
