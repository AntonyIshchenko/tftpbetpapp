import Session from '../schemas/sessionModel.js';
import 'dotenv/config';

export const findSession = async data => {
  return await Session.findOne(data);
};

export const createSession = async userId => {
  return await Session.create(userId);
};

export const deleteSession = async sessionId => {
  return await Session.findByIdAndDelete(sessionId);
};