import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StreamChat } from 'stream-chat';
import api from '../../utils/api';

const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

const getPersistedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('streamUser'));
  } catch (e) {
    return null;
  }
};

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/signup', formData);
      const { user, streamToken } = response.data;
      
      await streamClient.connectUser(
        { id: user._id, ...user }, 
        streamToken
      );
      
      localStorage.setItem('streamUser', JSON.stringify(user));
      return user;
    } catch (err) {
      await streamClient.disconnectUser();
      return rejectWithValue(err.response?.data || 'Signup failed');
    }
  }
);

export const googleAuthThunk = createAsyncThunk(
  'auth/googleAuth',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/google', { token });
      const { user, streamToken } = response.data;

      await streamClient.connectUser(
        { id: user._id, ...user },
        streamToken
      );
      
      localStorage.setItem('streamUser', JSON.stringify(user));
      return user;
    } catch (err) {
      await streamClient.disconnectUser();
      return rejectWithValue(err.response?.data || 'Google login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getPersistedUser(), 
    isLoading: false,        
    error: null,
    activeSession: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('streamUser');
      streamClient.disconnectUser();
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;