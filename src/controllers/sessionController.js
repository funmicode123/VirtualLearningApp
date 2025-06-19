const sessionService = require('../services/session.service');
const {AppError} = require('../utils/customErrors');
const CreateSessionResponse = require('../dto/response/session/createSession.response');
const validateHost =require('../utils/sessionUtils')
const {generateInviteToken}=require('../utils/generateInviteToken');
const SessionInvite=require('../models/sessionInvite');
const Session=require('../models/session');
const {generateStreamToken}=require('../utils/streamUtils');

exports.createSession = async (req, res, next) => {
  try {
    const sessionData = {
      ...req.body,
      host: req.user.id 
    };
    const session = await sessionService.createSession(sessionData);

    const token = await generateInviteToken(session.id, req.user.email);

    const baseUrl = process.env.BASE_URL;
    const sessionUrl = `${baseUrl}/join/${token}`;

    const streamToken = generateStreamToken(req.user.id);


    res.status(201).json({
      status: 'success',
      message:'Session crreated successfully',
      data: {
        ...CreateSessionResponse.from(session).toJSON(),
        link: sessionUrl,
        streamToken: streamToken
      },
    });
  } catch (err) {
    next(err);
  }
};


exports.joinViaInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email } = req.body;

    const invite = await SessionInvite.findOne({ token });
    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite token' });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(410).json({ message: 'Invite token has expired' });
    }

    const session = await Session.findOne({ id: invite.sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (req.user && !session.attendeeList.includes(req.user.email)) {
      session.attendeeList.push(req.user.email);
      await session.save();
    }

    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'User successfully joined the session via invite link',
      data: {
        session,
        sessionId: session.id,
        streamToken: streamToken
     }
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