import 'stream-chat-react/dist/css/v2/index.css';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';

const ChatBox = ({ chatClient, channel }) => {
  return (
    <Chat client={chatClient} theme="team light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatBox;
