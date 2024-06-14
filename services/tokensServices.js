import Session from '../schemas/sessionModel.js';
import 'dotenv/config';

export const findSession = async sessionId => {
  return await Session.findOne({ _id: sessionId });
};

export const createSession = async userId => {
  return await Session.create({ userId: userId });
};

export const deleteSession = async sessionId => {
  return await Session.findByIdAndDelete({ _id: sessionId });
};
