const Message = require('../models/Message');

class MessageRepository {
  async create(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }

  async findById(messageId) {
    return await Message.findById(messageId)
      .populate('sender_id', 'email');
  }

  async findAllByConversation(conversationId) {
    return await Message.find({ Conversation_id: conversationId })
      .sort({ timeStamp: 1 })
      .populate('sender_id', 'email');
  }

  async markAsRead(messageId) {
    return await Message.findByIdAndUpdate(
      messageId,
      { read_at: new Date() },
      { new: true }
    );
  }

  async delete(messageId) {
    return await Message.findByIdAndDelete(messageId);
  }
}

module.exports = new MessageRepository();
