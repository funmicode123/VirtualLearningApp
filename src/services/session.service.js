const sessionRepository = require('../repositories/session.repository');

class SessionService {
  async createSession(data) {
    return await sessionRepository.createSession(data);
  }

  async getSessionById(id) {
    return await sessionRepository.findById(id);
  }

  async getAllSessions() {
    return await sessionRepository.findAll();
  }

  async updateSession(id, updates) {
    return await sessionRepository.updateSession(id, updates);
  }

  async deleteSession(id) {
    return await sessionRepository.deleteSession(id);
  }

  async addAttendee(sessionId, userId) {
    return await sessionRepository.addAttendee(sessionId, userId);
  }
}

module.exports = new SessionService();
