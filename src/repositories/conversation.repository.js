const Conversation = require('../models/Conversation');

class ConversationRepository {
  async create(conversationData) {
    const conversation = new Conversation(conversationData);
    return await conversation.save();
  }

  async findById(id) {
    return await Conversation.findById(id)
      .populate('participants', 'email')
      .populate('messages');  
  }

  async findAllByParticipant(userId) {
    return await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 });
  }

  async addMessage(conversationId, messageId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { $push: { messages: messageId }, $set: { updatedAt: new Date() } },
      { new: true }
    );
  }

  async updateLastUpdated(conversationId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { updatedAt: new Date() } },
      { new: true }
    );
  }

  async delete(conversationId) {
    return await Conversation.findByIdAndDelete(conversationId);
  }
}

module.exports = new ConversationRepository();
