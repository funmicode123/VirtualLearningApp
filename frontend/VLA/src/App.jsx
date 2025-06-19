import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomePage from "./components/auth/pages/HomePage";
import SignupPage from "./components/auth/pages/SignupPage";
import LoginPage from "./components/auth/pages/LoginPage";
import Dashboard from "./components/auth/pages/Dashboard";
import NotFound from "./components/auth/pages/NotFound";
import LandingPage from "./components/auth/pages/LandingPage";
import JoinAndCreateSession from "./components/auth/pages/joinAndCreateSession/JoinAndCreateSession";
import JoinPage from "./components/auth/pages/joinAndCreateSession/JoinPage";
import Session from "./components/auth/pages/videoSession/Session";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sessions" element={<JoinAndCreateSession />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/liveSession" element={<Session />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
