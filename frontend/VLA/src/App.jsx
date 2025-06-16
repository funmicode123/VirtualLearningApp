import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomePage from './components/auth/pages/HomePage';
import SignupPage from './components/auth/pages/SignupPage';
import LoginPage from './components/auth/pages/LoginPage';
import Dashboard from './components/auth/pages/Dashboard';
import NotFound from './components/auth/pages/NotFound';
import JoinAndCreateSession from './components/auth/pages/joinAndCreateSession/JoinAndCreateSession';
import JoinPage from './components/auth/pages/joinAndCreateSession/JoinPage';

const App = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sessions" element={<JoinAndCreateSession />} />            <Route path="/login" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;