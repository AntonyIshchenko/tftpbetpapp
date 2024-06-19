import Session from '../schemas/sessionModel.js';
import 'dotenv/config';

export const findSession = async data => {
  return await Session.findOne(data);
};

export const createSession = async userId => {
  return await Session.create(userId);
};

export const updateSession = (sessionData, updatedData) =>
  Session.findOneAndUpdate(sessionData, updatedData, { new: true });

export const deleteSession = async sessionId => {
  return await Session.findByIdAndDelete(sessionId);
};

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

// export const deleteAllExceptCurrent = async (userId, currentSessionId) => {
//   return await Session.deleteMany({
//     userId: userId,
//     _id: { $ne: currentSessionId },
//   });
// };
