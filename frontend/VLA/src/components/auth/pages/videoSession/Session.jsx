import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  setLogLevel,
  useCall,
  useCallStateHooks,
  CallingState,
  SpeakerLayout, CallControls, CallParticipantsList
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export default function Session() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const navigate = useNavigate();

  const streamToken = useSelector((state) => state.session.streamToken);
  setLogLevel('debug');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('activeSession'));
    const streamUser = JSON.parse(localStorage.getItem('streamUser'));

    if (!session || !streamUser || !streamToken) {
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

    const clientInstance = new StreamVideoClient({ apiKey, user, token: streamToken });
    const callInstance = clientInstance.call('default', session.sessionId);

    console.log("Connecting to call with ID:", session.sessionId);

    setClient(clientInstance);
    setCall(callInstance);

    callInstance.join({ create: true })
      .then(() => {
        console.log(' Joined call successfully');
      })
      .catch(err => {
        console.error(" Failed to join call:", err);
      });
  }, [navigate, streamToken]);

  if (!client || !call) return <div>Loading session...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <LiveVideoUI />
      </StreamCall>
    </StreamVideo>
  );
}

function LiveVideoUI() {
  const call = useCall();
  const {
    useCallCallingState,
    useParticipantCount,
    useCameraState,
    useMicrophoneState
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const camera = useCameraState();
  const mic = useMicrophoneState();
  const participantCount = useParticipantCount();

  useEffect(() => {
    console.log(" CallingState:", callingState);
    console.log(" ParticipantCount:", participantCount);
    console.log(" Camera:", camera);
    console.log(" Mic:", mic);
    console.log(" Full call object:", call);
  }, [callingState, participantCount, camera, mic, call]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(" Camera/Mic access granted.");
        stream.getTracks().forEach(track => track.stop()); 
      })
      .catch((err) => {
        console.error(" Camera/Mic access denied:", err);
      });
  }, []);

  if (callingState !== CallingState.JOINED) {
    return <div style={{ color: 'white' }}>Joining the call...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
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
