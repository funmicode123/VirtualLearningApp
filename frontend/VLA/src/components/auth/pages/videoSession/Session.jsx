// import {
//   StreamVideoClient,
//   StreamVideo,
//   StreamCall,
//   setLogLevel,
//   useCall,
//   useCallStateHooks,
//   CallingState,
//   SpeakerLayout, CallControls, CallParticipantsList
// } from '@stream-io/video-react-sdk';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {jwtDecode} from 'jwt-decode';

// const apiKey = import.meta.env.VITE_STREAM_API_KEY;
// console.log("API Key:", apiKey);
// if (!apiKey) {
//   console.error("API Key is missing. Check your .env file.");
// }

// export default function Session() {
//   const [client, setClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const navigate = useNavigate();

//   const streamToken = useSelector((state) => state.session.streamToken);

//   useEffect(() => {
//     const session = JSON.parse(localStorage.getItem('activeSession'));
//     const streamUser = JSON.parse(localStorage.getItem('streamUser'));

//     if (!session || !streamUser) {
//       alert('Missing session details. Please join again.');
//       navigate('/join');
//       return;
//     }

//     const { user_id } = jwtDecode(streamToken);

//     const user = {
//       id: user_id,
//       name: streamUser.email,
//       image: `https://getstream.io/random_svg/?id=${streamUser.email}&name=${streamUser.email}`,
//     };

//     const clientInstance = new StreamVideoClient({ apiKey, user, token: streamToken });
//     const callInstance = clientInstance.call('default', session.sessionId);

//     console.log("Connecting to call with ID:", session.sessionId);

//     setClient(clientInstance);
//     setCall(callInstance);

//     callInstance.join({ create: true })
//       .then(() => {
//         console.log(' Joined call successfully');
//       })
//       .catch(err => {
//         console.error(" Failed to join call:", err);
//       });

//     return () => {
//       if (callInstance) callInstance.leave().catch(err => console.error("Leave error:", err));

//       if (clientInstance) {clientInstance.disconnectUser().catch(err => console.error("Disconnect error:", err));}
//     };
      
//   }, [navigate, streamToken]);

//   if (!client || !call) return <div>Loading session...</div>;

//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//         {/* <LiveVideoUI /> */}
//         <div style={{ height: '100vh', backgroundColor: '#1e1e1e' }}>
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

//   useEffect(() => {
//     console.log("Calling State:", callingState);
//     console.log("Participant Count:", participantCount);
//     console.log("Call Object:", call);
//   }, [callingState, participantCount, call]);

//   if (!call) return <div style={{ color: 'white' }}>Call not initialized...</div>;

//   if (callingState === CallingState.IDLE || callingState === CallingState.JOINING) {
//     return (
//       <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
//         Connecting to the call... <br />
//         State: {callingState}
//       </div>
//     );
//   }

//   if (callingState !== CallingState.JOINED) {
//     return (
//       <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
//         Failed to join the call. State: {callingState}
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e1e' }}>
//       <div style={{ flex: 3, padding: '10px' }}>
//         <SpeakerLayout />
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
  setLogLevel,
  useCall,
  useCallStateHooks,
  CallingState,
  SpeakerLayout,
  CallControls,
  CallParticipantsList,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
console.log("API Key:", apiKey);
if (!apiKey) {
  console.error("API Key is missing. Check your .env file.");
  throw new Error("API Key is missing. Please configure VITE_STREAM_API_KEY in .env.");
}

export default function Session() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const navigate = useNavigate();

  const streamToken = useSelector((state) => state.session.streamToken);
  console.log("Stream Token from Redux:", streamToken);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('activeSession'));
      const streamUser = JSON.parse(localStorage.getItem('streamUser'));

      if (!session || !streamUser || !streamToken) {
        console.error("Missing session details:", { session, streamUser, streamToken });
        alert('Missing session details. Please join again.');
        navigate('/join');
        return;
      }

      const { user_id } = jwtDecode(streamToken);

      const user = {
        id: user_id,
        name: streamUser.email,
        image: `https://getstream.io/random_svg/?id=${streamUser.email}&name=${streamUser.email}`,
      };

      console.log("Initializing client with:", { apiKey, user, streamToken });

      const clientInstance = new StreamVideoClient({ apiKey, user, token: streamToken });
      const callInstance = clientInstance.call('default', session.sessionId);

      console.log("Connecting to call with ID:", session.sessionId, "User ID:", user_id);

      setClient(clientInstance);
      setCall(callInstance);

      callInstance.join({ create: true })
        .then(() => {
          console.log('Successfully joined call');
        })
        .catch((err) => {
          console.error("Failed to join call:", err);
          alert(`Failed to join the call. Error: ${err.message || 'Unknown error'}. Check console for details.`);
        });

      return () => {
        if (callInstance) {
          callInstance.leave().catch(err => console.error("Leave error:", err));
        }
        if (clientInstance) {
          clientInstance.disconnectUser().catch(err => console.error("Disconnect error:", err));
        }
      };
    } catch (error) {
      console.error("Error in useEffect:", error);
      alert(`An error occurred: ${error.message}. Check console for details.`);
    }
  }, [navigate, streamToken]);

  if (!client || !call) return <div className="loading">Loading session...</div>;

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

  useEffect(() => {
    console.log("LiveVideoUI - Calling State:", callingState);
    console.log("LiveVideoUI - Participant Count:", participantCount);
    console.log("LiveVideoUI - Call Object:", call);
  }, [callingState, participantCount, call]);

  if (!call) {
    return <div className="loading">Call not initialized...</div>;
  }

  if (callingState === CallingState.IDLE || callingState === CallingState.JOINING) {
    return (
      <div className="loading">
        Connecting to the call... <br />
        State: {callingState}
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="loading">
        Failed to join the call. State: {callingState}
      </div>
    );
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