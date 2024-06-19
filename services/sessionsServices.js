import Session from '../schemas/sessionModel.js';
import 'dotenv/config';

export const findSession = async data => Session.findOne(data);

export const findAllSessions = async data => Session.find(data);

export const createSession = async userId => Session.create(userId);

export const updateSession = async (sessionData, updatedData) =>
  Session.findOneAndUpdate(sessionData, updatedData, { new: true });

export const deleteSession = async sessionId =>
  Session.findByIdAndDelete(sessionId);

export const deleteAllExceptCurrent = async (userId, currentSessionId) => {
  const sessionsToDelete = await Session.find({
    userId: userId,
    _id: { $ne: currentSessionId },
  });

  await Session.deleteMany({
    userId: userId,
    _id: { $ne: currentSessionId },
  });
  return sessionsToDelete;
};
