import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const signupThunk = createAsyncThunk(
  'auth/signup',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/signup', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Signup failed'
      );
    }
  }
);

const googleAuthThunk = createAsyncThunk(
  'auth/googleAuth',
  async (googleToken, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/google', { 
        token: googleToken 
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Google authentication failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
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

export {signupThunk, googleAuthThunk, authSlice};
export const { logout } = authSlice.actions;
export default authSlice.reducer;