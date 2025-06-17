// import { StreamVideo, StreamCall, StreamVideoClient, CallControls, CallParticipantsList, SpeakerLayout, Chat, useCall, useCallStateHooks, CallingState,} from '@stream-io/video-react-sdk';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../../../../utils/api'; 

// const user = {
//   id: 'Captain_Rex',
//   name: 'Captain Rex',
//   image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
// };

// const token = 'YOUR_USER_TOKEN';

// export default function VideoPlayer() {
//   const { callId } = useParams();
//   const [client, setClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const [joined, setJoined] = useState(false);

//   useEffect(() => {
//     if (!callId) return;

//     const apiKey = import.meta.env.VITE_STREAM_API_KEY;

//     const streamClient = new StreamVideoClient({ apiKey, user, token });
//     const callInstance = streamClient.call('default', callId);
    
//     setClient(streamClient);
//     setCall(callInstance);

//     const joinCall = async () => {
//       await callInstance.join({ create: true });
//       setJoined(true);
//     };

//     joinCall();
//   }, [callId]);

//   if (!joined || !client || !call) return <div>Joining call...</div>;

//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//         <LiveVideoUI />
//       </StreamCall>
//     </StreamVideo>
//   );
// }

// const LiveVideoUI = () => {
//   const call = useCall();
//   const { useCallCallingState } = useCallStateHooks();
//   const callingState = useCallCallingState();

//   if (callingState !== CallingState.JOINED) {
//     return <div>Loading video session...</div>;
//   }

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Left: Video */}
//       <div style={{ flex: 3, padding: '10px' }}>
//         <SpeakerLayout />
//         <CallControls />
//       </div>

//       {/* Right: Chat and Participants */}
//       <div style={{ flex: 1, borderLeft: '1px solid #ccc', padding: '10px' }}>
//         <Chat />
//         <CallParticipantsList />
//       </div>
//     </div>
//   );
// };


import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api'; 

export default function VideoPlayer() {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const joinCall = async () => {
      if (!callId) return;

      const apiKey = import.meta.env.VITE_STREAM_API_KEY;
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        console.error('User not found in localStorage');
        return;
      }

      // Request user token from your backend
      try {
        const response = await api.post('/stream/token', { userId: storedUser.id });
        const { token } = response.data;

        const user = {
          id: storedUser.id,
          name: storedUser.name,
          image: storedUser.image || `https://getstream.io/random_svg/?id=${storedUser.id}&name=${storedUser.name}`,
        };

        const streamClient = new StreamVideoClient({ apiKey, user, token });
        const callInstance = streamClient.call('default', callId);

        setClient(streamClient);
        setCall(callInstance);

        await callInstance.join({ create: true });
        setJoined(true);
      } catch (error) {
        console.error('Error joining call:', error);
      }
    };

    joinCall();
  }, [callId]);

  if (!joined || !client || !call) return <div>Joining call...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <LiveVideoUI />
      </StreamCall>
    </StreamVideo>
  );
}

const LiveVideoUI = () => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading video session...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 3, padding: '10px' }}>
        <SpeakerLayout />
        <CallControls />
      </div>
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', padding: '10px' }}>
        <Chat />
        <CallParticipantsList />
      </div>
    </div>
  );
};
