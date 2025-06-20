import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { IdCard } from 'lucide-react';

const signupThunk = createAsyncThunk(
  'auth/signup',
  async (formData, thunkAPI) => {
    try {
      localStorage.clear();
      const response = await axiosInstance.post('/signup', formData);
      const { token, email, id } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('streamUserEmail', JSON.stringify(email));
      localStorage.setItem('streamUserId', JSON.stringify(id));

      return { email, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Signup failed'
      );
    }
  }
);

const loginThunk = createAsyncThunk(
  'auth/login',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Login failed'
);

    }
  }
);

const googleAuthThunk = createAsyncThunk(
  'auth/googleAuth',
  async (googleToken, thunkAPI) => {
    try {
      localStorage.clear();
      const response = await axiosInstance.post('/auth/google', { 
        token: googleToken 
      });
      const { token, email, id } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('streamUserEmail', JSON.stringify(email));
      localStorage.setItem('streamUserId', JSON.stringify(id));
      
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Google authentication failed'
      );
    }
  }
);

const storedUserStr = localStorage.getItem('streamUser');
const storedUser = storedUserStr && storedUserStr !== 'undefined' ? JSON.parse(storedUserStr) : null;
const storedToken = localStorage.getItem('authToken');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken || null,
    loading: false,
    error: null,
    activeSession: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  
extraReducers: (builder) => {
  builder
    .addCase(signupThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    .addCase(googleAuthThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })

    .addMatcher(
      (action) =>
        [signupThunk.pending.type, googleAuthThunk.pending.type].includes(action.type),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    )
    .addMatcher(
      (action) =>
        [signupThunk.rejected.type, googleAuthThunk.rejected.type].includes(action.type),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
}

});

export {signupThunk, googleAuthThunk, loginThunk, authSlice};
export const { logout } = authSlice.actions;
export default authSlice.reducer;