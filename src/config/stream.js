const { StreamChat } = require('stream-chat');
require('dotenv').config();

const api_key = process.env.STREAM_API;
const api_secret = process.env.STREAM_SECRET_KEY;

if (!api_key || !api_secret) {
  throw new Error("Stream API key or secret key is missing");
}

const chatClient = StreamChat.getInstance(api_key, api_secret);

const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    throw new Error(`Error upserting stream user: ${error.message}`);
  }
};

const generateStreamToken = (userId) => {
  return chatClient.createToken(userId);
};

module.exports = {
  upsertStreamUser,
  generateStreamToken,
};
