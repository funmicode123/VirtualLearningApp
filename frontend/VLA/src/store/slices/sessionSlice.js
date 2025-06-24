import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { StreamChat } from 'stream-chat';
import { jwtDecode } from 'jwt-decode';


const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

export const joinSessionThunk = createAsyncThunk(
  'session/join',
  async (linkCode, { rejectWithValue }) => {
    try {
      const jwtToken = localStorage.getItem('authToken');
      const res = await api.patch(`/sessions/join/${linkCode}`,{},

        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const { data } = res.data;
      const { session, streamToken } = data;

      const userEmail = session.attendeeList[session.attendeeList.length - 1];

      localStorage.setItem('streamUser', JSON.stringify({ email: userEmail }));
      localStorage.setItem('activeSession', JSON.stringify({...session, sessionId: session.id, chatChannelId,}));

      return { session, streamToken };
    } catch (err) {
      console.error('Join error response:', err.response?.data);
      return rejectWithValue(err.response?.data || 'Failed to join session');
    }
  }
);


export const hostSessionThunk = createAsyncThunk(
  'session/host',
  async ({ topic, startTime, endTime}, { rejectWithValue }) => {
    try {
      const jwtToken = localStorage.getItem('authToken');
      const userEmail = JSON.parse(localStorage.getItem('streamUserEmail'));
      const userId = localStorage.getItem('streamUserId');

      if (!jwtToken || !userEmail || !userId) {
        return rejectWithValue('Authentication data missing');
      }

      const payload = {
        topic,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        attendeeList: [userEmail],
      };

      const res = await api.post('/sessions', payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
   
      const { data } = res.data; 
      const { streamToken, sessionId, link, chatChannelId, ...sessionDetails } = data;

      localStorage.setItem('streamUser', JSON.stringify({ email: userEmail }));
      localStorage.setItem('activeSession', JSON.stringify({streamToken, sessionId, link, chatChannelId, ...sessionDetails}));
      localStorage.setItem('streamToken', streamToken);

      return { session: {streamToken, sessionId, link, ...sessionDetails}, streamToken };
    } catch (err) {
        if (err?.response?.data) {
          console.log('Backend Error:', err.response.data);
        } else {
          console.log('Thunk rejection:', err);
        }
      return rejectWithValue(err.response?.data || 'Failed to host session');
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
      })

      .addCase(hostSessionThunk.pending, (state) => {
        state.isJoining = true;
        state.error = null;
      })
      .addCase(hostSessionThunk.fulfilled, (state, action) => {
        state.isJoining = false;
        state.session = action.payload.session;
        state.streamToken = action.payload.streamToken;
      })
      .addCase(hostSessionThunk.rejected, (state, action) => {
        state.isJoining = false;
        state.error = action.payload;
      });

  },
});

export default sessionSlice.reducer;
