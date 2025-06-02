const sessionService = require('../services/session.service');
const AppError = require('../utils/customErrors');
const CreateSessionResponse = require('../dto/response/session/createSession.response');
const validateHost =require('../utils/sessionUtils')


exports.createSession = async (req, res, next) => {
  try {
    const sessionData = {
      ...req.body,
      host: req.user.id 
    };
    const session = await sessionService.createSession(sessionData);
    res.status(201).json({
      status: 'success',
      data: CreateSessionResponse.from(session).toJSON()
    });
  } catch (err) {
    next(err);
  }
};

exports.joinSession = async (req, res, next) => {
  try {
    const session = await sessionService.joinSession(
      req.params.id,
      req.user.id 
    );
    res.status(200).json({
      status: 'success',
      data: session
    });
  } catch (error) {
    next(error); 
  }
};

exports.getAllSessions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.host) filter.host = req.query.host;
    if (req.query.upcoming) filter.startTime = { $gt: new Date() };
    
    const sessions = await sessionService.getAllSessions(filter);
    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: CreateSessionResponse.fromList(sessions)
    });
  } catch (err) {
    next(err);
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: CreateSessionResponse.from(session).toJSON()
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    validateHost(session, req.user.id);
    
    const updated = await sessionService.updateSession(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: CreateSessionResponse.from(updated).toJSON()
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    validateHost(session, req.user.id);
    
    await sessionService.deleteSession(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getMySessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getAllSessions({ host: req.user.id });
    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: CreateSessionResponse.fromList(sessions)
    });
  } catch (err) {
    next(err);
  }
};