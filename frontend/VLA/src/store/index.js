import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';

const token = localStorage.getItem('token');

const initialState = {
  auth: {
    token,
    user: token ? parseJwt(token) : null,
    loading: false,
    error: null,
  },
};

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return { id: payload.id };
  } catch (e) {
    return null;
  }
}

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: initialState,
});

export default store;
