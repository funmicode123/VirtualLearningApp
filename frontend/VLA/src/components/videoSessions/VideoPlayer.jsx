import {StreamVideo, StreamCall, StreamVideoClient, CallControls, CallParticipantsList, SpeakerLayout, Chat, useCall, useCallStateHooks, CallingState,} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const user = {
  id: 'Captain_Rex',
  name: 'Captain Rex',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};
const token = 'YOUR_USER_TOKEN'; 
const callId = 'N2uhmodXiqFh';

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);

export default function VideoPlayer() {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const joinCall = async () => {
      await call.join({ create: true });
      setJoined(true);
    };
    joinCall();
  }, []);

  if (!joined) return <div>Joining call...</div>;

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
      {/* Left Side: Video Display */}
      <div style={{ flex: 3, padding: '10px' }}>
        <SpeakerLayout />
        <CallControls />
      </div>

      {/* Right Side: Chat + Participants */}
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', padding: '10px' }}>
        <Chat />
        <CallParticipantsList />
      </div>
    </div>
  );
};
