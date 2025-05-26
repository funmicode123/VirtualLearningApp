const Message = require('../repositories/message.repository');
const Conversation = require('../repositories/conversation.repository');

class MessageService {
    async createMessage({conversationId, senderId, content, messageType = 'text', attachments = []}) {
      const conversation = await this.#validateConversationExists(conversationId);     
      const messageInformation = {
        conversationId,
        senderId,
        content,
        messageType,
        attachments
      };

      const message = await Message.create(messageInformation);
      return message;
    }

    async deleteMessage({conversationId, messageId}) {
      const conversation = await this.#validateConversationExists(conversationId);     

      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      if (message.conversationId.toString() !== conversationId.toString()) {
        throw new Error('Message does not belong to the given conversation');
      }

      await Message.delete(messageId);
      await Conversation.removeMessageFromConversation(conversationId);

      return {success: true, message: "Message deleted Successfully"};
    }

    async #validateConversationExists(conversationId){
      const foundConversation = await Conversation.findById(conversationId);
      if (!foundConversation) {
        throw new Error('Conversation not found');
      }
    }

    async #validateMessageExist(messageId){

    }
}
module.exports = new MessageService();
