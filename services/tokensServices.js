import Session from '../schemas/sessionModel.js';
import 'dotenv/config';

export const findSession = sessionId => {
  Session.findById(sessionId);
};
