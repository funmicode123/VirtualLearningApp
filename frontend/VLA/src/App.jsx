import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomePage from './components/auth/pages/HomePage';
import SignupPage from './components/auth/pages/SignupPage';
import LoginPage from './components/auth/pages/LoginPage';
import Dashboard from './components/auth/pages/Dashboard';
import NotFound from './components/auth/pages/NotFound';
import LandingPage from './components/auth/pages/LandingPage';

const App = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;