// import {
//   StreamVideoClient,
//   StreamVideo,
//   StreamCall,
//   useCall,
//   useCallStateHooks,
//   CallingState,
//   SpeakerLayout,
//   CallControls,
//   CallParticipantsList,
// } from '@stream-io/video-react-sdk';
// import { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';

// const apiKey = import.meta.env.VITE_STREAM_API_KEY;

// export default function Session() {
//   const [client, setClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const hasJoinedRef = useRef(false); 

//   const clientRef = useRef(null);
//   const callRef = useRef(null);

//   const navigate = useNavigate();
//   const streamToken = useSelector((state) => state.session.streamToken);

//   useEffect(() => {
//     if (!streamToken || hasJoinedRef.current) return;

//     const setupCall = async () => {
//       try {
//         const session = JSON.parse(localStorage.getItem('activeSession'));
//         const streamUser = JSON.parse(localStorage.getItem('streamUser'));

//         if (!session || !streamUser) {
//           alert('Missing session details. Please join again.');
//           navigate('/createSession');
//           return;
//         }

//         const { user_id } = jwtDecode(streamToken);
//         const user = {
//           id: user_id,
//           name: streamUser.email,
//           image: `https://getstream.io/random_svg/?id=${streamUser.email}&name=${streamUser.email}`,
//         };

//         const clientInstance = StreamVideoClient.getOrCreateInstance({
//           apiKey,
//           user,
//           token: streamToken,
//         });

//         await clientInstance.connectUser(user, streamToken);

//         const callInstance = clientInstance.call('default', session.sessionId);

//         clientRef.current = clientInstance;
//         callRef.current = callInstance;
//         setClient(clientInstance);
//         setCall(callInstance);

//         await callInstance.join({ create: true });
//         await callInstance.camera.enable();
//         await callInstance.microphone.enable();

//         hasJoinedRef.current = true; 

//       } catch (error) {
//         alert(`Join error: ${error.message}`);
//       }
//     };

//     setupCall();

//     return () => {
//       if (callRef.current) {
//         callRef.current.leave().catch((err) => console.error("Leave error:", err));
//       }
//       if (clientRef.current) {
//         clientRef.current.disconnectUser().catch((err) => console.error("Disconnect error:", err));
//       }
//     };
//   }, [navigate, streamToken]);

//   if (!client || !call) {
//     return <div className="loading">Loading session...</div>;
//   }

//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//         <div className="sessionContainer">
//           <LiveVideoUI />
//         </div>
//       </StreamCall>
//     </StreamVideo>
//   );
// }

// function LiveVideoUI() {
//   const call = useCall();
//   const { useCallCallingState, useParticipantCount } = useCallStateHooks();
//   const callingState = useCallCallingState();
//   const participantCount = useParticipantCount();

//   if (!call) return <div className="loading">Call not initialized...</div>;

//   if (callingState === CallingState.IDLE || callingState === CallingState.JOINING) {
//     return <div className="loading">Connecting to the call...<br />State: {callingState}</div>;
//   }

//   if (callingState !== CallingState.JOINED) {
//     return <div className="loading">Failed to join the call. State: {callingState}</div>;
//   }

//   return (
//     <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e1e' }}>
//       <div style={{ flex: 3, padding: '10px' }}>
//         <SpeakerLayout style={{ border: '2px solid red' }} />
//         <CallControls />
//       </div>
//       <div style={{ flex: 1, borderLeft: '1px solid #ccc', padding: '10px' }}>
//         <CallParticipantsList />
//       </div>
//     </div>
//   );
// }































import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  useCall,
  useCallStateHooks,
  CallingState,
  SpeakerLayout,
  CallControls,
  CallParticipantsList,
} from '@stream-io/video-react-sdk';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let singletonClient = null; // ✅ Global singleton to avoid multiple connectUser calls

export default function Session() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  const callRef = useRef(null);
  const navigate = useNavigate();
  const streamToken = useSelector((state) => state.session.streamToken);

  useEffect(() => {
    const setupCall = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('activeSession'));
        const streamUser = JSON.parse(localStorage.getItem('streamUser'));

        if (!session || !streamUser || !streamToken) {
          alert('Missing session details. Please join again.');
          navigate('/createSession');
          return;
        }

        const { user_id } = jwtDecode(streamToken);
        const user = {
          id: user_id,
          name: streamUser.email,
          image: `https://getstream.io/random_svg/?id=${streamUser.email}&name=${streamUser.email}`,
        };

        if (!singletonClient) {
          singletonClient = new StreamVideoClient({ apiKey });
          await singletonClient.connectUser(user, streamToken);
        }

        const callInstance = singletonClient.call('default', session.sessionId);
        await callInstance.join({ create: true });
        await callInstance.camera.enable();
        await callInstance.microphone.enable();

        callRef.current = callInstance;
        setClient(singletonClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Setup Error:", error);
        alert(`Join error: ${error.message}`);
      }
    };

    setupCall();

    return () => {
      if (callRef.current) {
        callRef.current.leave().catch((err) => console.error("Leave error:", err));
      }
    };
  }, [navigate, streamToken]);

  if (!client || !call) {
    return <div className="loading">Loading session...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="sessionContainer">
          <LiveVideoUI />
        </div>
      </StreamCall>
    </StreamVideo>
  );
}

function LiveVideoUI() {
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (!call) return <div className="loading">Call not initialized...</div>;

  if (callingState === CallingState.IDLE || callingState === CallingState.JOINING) {
    return <div className="loading">Connecting to the call...<br />State: {callingState}</div>;
  }

  if (callingState !== CallingState.JOINED) {
    return <div className="loading">Failed to join the call. State: {callingState}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e1e' }}>
      <div style={{ flex: 3, padding: '10px' }}>
        <SpeakerLayout />
        <CallControls />
      </div>
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', padding: '10px' }}>
        <CallParticipantsList />
      </div>
    </div>
  );
}
