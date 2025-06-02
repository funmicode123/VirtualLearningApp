const sessionRepository = require('../repositories/session.repository');
const { 
  BadRequestError, 
  NotFoundError,
  InternalServerError 
} = require('../utils/customErrors');

const validateUUID = require('../utils/validateUUID')

class SessionService {
  async createSession(data) {
    try {
      return await sessionRepository.createSession(data);
    } catch (error) {
      if (error.code === 11000) { 
        throw new AppError('Session with similar details already exists', 400);
      }
      throw new AppError('Failed to create session', 500);
    }
  }

  async getSessionById(id) {
    const session = await sessionRepository.findById(id);
    if (!validateUUID(id)) {
      throw new AppError('Invalid session ID format', 400);
    }

    if (!session) {
      throw new AppError('Session not found', 404);
    }
    return session;
  }

  async getAllSessions(filter = {}) {
    try {
      return await sessionRepository.findAll(filter);
    } catch (error) {
      throw new AppError('Failed to retrieve sessions', 500);
    }
  }

  async updateSession(id, updates) {
    try {
      const updatedSession = await sessionRepository.updateSession(id, updates);
      if (!updatedSession) {
        throw new AppError('Session not found', 404);
      }
      return updatedSession;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update session', 500);
    }
  }

  async deleteSession(id) {
    try {
      const deletedSession = await sessionRepository.deleteSession(id);
      if (!deletedSession) {
        throw new AppError('Session not found', 404);
      }
      return deletedSession;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete session', 500);
    }
  }

  async joinSession(sessionId, userId) {
    if (!validateUUID(sessionId) ){
      throw new BadRequestError('Invalid session ID format');
    }
    if (!validateUUID(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }

    try {
      const session = await this.getSessionById(sessionId);
      
      const alreadyJoined = session.attendeeList.some(attendeeId => 
        attendeeId.toString() === userId.toString()
      );

      if (!alreadyJoined) {
        session.attendeeList.push(userId);
        await session.save();
      }

      return session;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError('Failed to join session')
        .withMetadata({ sessionId, userId });
    }
  }
}

module.exports = new SessionService();