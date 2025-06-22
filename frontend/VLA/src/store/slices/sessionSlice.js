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

      // await streamClient.connectUser(
      //   { id: userEmail },
      //   streamToken
      // );

      localStorage.setItem('streamUser', JSON.stringify({ email: userEmail }));
      localStorage.setItem('activeSession', JSON.stringify(session));

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
      // const userId = userEmail;

      // console.log('userId:', userId);
      // console.log('userEmail:', userEmail);

      if (!jwtToken || !userEmail || !userId) {
        return rejectWithValue('Authentication data missing');
      }

      const payload = {
        topic,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        attendeeList: [userEmail],
      };

      // console.log('Hosting payload: ', payload);

      const res = await api.post('/sessions', payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
   
      const { data } = res.data; 
      const { streamToken, sessionId, link, ...sessionDetails } = data;

      // console.log("Stream Token from Host Session Thunk", streamToken);
      // console.log('Connecting Stream user with id:', userId);
      // console.log('userId from localStorage:', userId);
      // console.log('decoded streamToken:', jwtDecode(streamToken));

      localStorage.setItem('streamUser', JSON.stringify({ email: userEmail }));
      localStorage.setItem('activeSession', JSON.stringify({streamToken, sessionId, link, ...sessionDetails}));
      localStorage.setItem('streamToken', streamToken);

      return { session: {streamToken, sessionId, link, ...sessionDetails}, streamToken };
    } catch (err) {
      // console.error('hostSessionThunk error:', err?.response?.data || err.message || err);
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
