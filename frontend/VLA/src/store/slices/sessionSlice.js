import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { StreamChat } from 'stream-chat';

const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

export const joinSessionThunk = createAsyncThunk(
  'session/join',
  async (linkCode, { rejectWithValue }) => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGMzZmVmLWVlZmItNGEzNC1hMjQzLWFiOGYzMDFlNTZlZSIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE3NTAxNjY5NTcsImV4cCI6MTc1MDc3MTc1N30.L4gPbTMFUY_P1s6lcOueN8N33dcVU1_wzKffaBxcb7A";

      // const token = localStorage.getItem('token');

      const res = await api.patch(`/sessions/join/${linkCode}`,{},
      // const res = await api.patch(`/sessions/join/9c2c9aae-8a35-441d-92d4-3093734b398b`,{},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = res.data;
      const { session, streamToken } = data;

      // const userEmail = session.attendeeList[session.attendeeList.length - 1];

      const userEmail = session?.attendeeList?.at(-1) || 'dummy@example.com';


      await streamClient.connectUser(
        { id: userEmail },
        streamToken
      );

      localStorage.setItem('streamUser', JSON.stringify({ email: userEmail }));
      localStorage.setItem('activeSession', JSON.stringify(session));

      return { session, streamToken };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to join session');
    }
  }
);


const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    session: null,
    streamToken: null,
    isJoining: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(joinSessionThunk.pending, (state) => {
        state.isJoining = true;
        state.error = null;
      })
      .addCase(joinSessionThunk.fulfilled, (state, action) => {
        state.isJoining = false;
        state.session = action.payload.session;
        state.streamToken = action.payload.streamToken;
      })
      .addCase(joinSessionThunk.rejected, (state, action) => {
        state.isJoining = false;
        state.error = action.payload;
      });
  },
});

export default sessionSlice.reducer;
