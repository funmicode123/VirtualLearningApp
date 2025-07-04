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
import ChatBox from './ChatBox';
import Split from 'react-split';
import './SplitLayout.css';
import { StreamChat } from 'stream-chat'; 

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let singletonClient = null; 

export default function Session() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null); 
  const [channel, setChannel] = useState(null);       

  const callRef = useRef(null);
  const navigate = useNavigate();
  const streamToken = useSelector((state) => state.session.streamToken);

  useEffect(() => {
    const setupCallAndChat = async () => {
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

        const chat = StreamChat.getInstance(apiKey);

        // await chat.connectUser(user, streamToken);
        if (!chat.user || chat.user.id !== user.id) {
          await chat.connectUser(user, streamToken);
        }

        const chatChannel = chat.channel('messaging', session.chatChannelId);
        await chatChannel.watch();

        setChatClient(chat);
        setChannel(chatChannel);
      } catch (error) {
        console.error("Setup Error:", error);
        alert(`Join error: ${error.message}`);
      }
    };

    setupCallAndChat();

    return () => {
      if (callRef.current) callRef.current.leave().catch(console.error);
      if (chatClient) chatClient.disconnectUser().catch(console.error);
    };
  }, [navigate, streamToken]);

  if (!client || !call || !chatClient || !channel) {
    return <div className="loading">Loading session and chat...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <Split
          sizes={[70, 30]} 
          minSize={300}
          gutterSize={7}
          direction="horizontal"
          className="split-layout"
        >
          <div style={{ padding: '10px' }}>
            <SpeakerLayout />
            <CallControls />
          </div>

          <div style={{ borderLeft: '1px solid #ccc', padding: '10px' }}>
            <CallParticipantsList />
            <ChatBox chatClient={chatClient} channel={channel} />
          </div>
        </Split>
      </StreamCall>
    </StreamVideo>
  );
}

