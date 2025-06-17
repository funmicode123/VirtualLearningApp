import { StreamVideoClient, StreamVideo, StreamCall } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LiveVideoUI from '../../../videoSessions/VideoPlayer';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export default function Session() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const navigate = useNavigate();

  // ❗ Move useSelector out of useEffect
  const streamToken = useSelector((state) => state.session.streamToken);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('activeSession'));
    const streamUser = JSON.parse(localStorage.getItem('streamUser'));

    if (!session || !streamUser || !streamToken) {
      alert('Missing session details. Please join again.');
      navigate('/join');
      return;
    }

    const user = {
      id: streamUser.email,
      name: streamUser.email,
      image: `https://getstream.io/random_svg/?id=${streamUser.email}&name=${streamUser.email}`,
    };

    const clientInstance = new StreamVideoClient({ apiKey, user, token: streamToken });
    const callInstance = clientInstance.call('default', session.id);

    setClient(clientInstance);
    setCall(callInstance);

    callInstance.join({ create: false }).catch(console.error);
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
