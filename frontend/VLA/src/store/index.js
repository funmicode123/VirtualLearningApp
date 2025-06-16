import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import sessionReducer from '../store/slices/sessionSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
  },
});

export default store;
