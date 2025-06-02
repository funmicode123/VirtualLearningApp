const Session = require('../models/session');

class SessionRepository {
  async createSession(data) {
    return await Session.create(data);
  }

  async joinSession(sessionId, userId) {
    return await Session.findOneAndUpdate(
      { id: sessionId },
      { $addToSet: { attendeeList: userId } },
      { new: true }
    ).populate('attendeeList');
  }

  async findById(id) {
    return await Session.findOne({ id }).populate('attendeeList');
  }

  async findAll() {
    return await Session.find().populate('attendeeList');
  }

  async updateSession(id, updates) {
    return await Session.findOneAndUpdate({ id }, updates, { new: true });
  }

  async deleteSession(id) {
    return await Session.findOneAndDelete({ id });
  }

  async addAttendee(sessionId, userId) {
    return await Session.findOneAndUpdate(
      { id: sessionId },
      { $addToSet: { attendeeList: userId } },
      { new: true }
    );
  }
}

module.exports = new SessionRepository();
