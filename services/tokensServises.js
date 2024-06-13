import Session from '../schemas/sessionModel.js';
import 'dotenv/config';

export const findToken = (userId, refreshToken) => {
  Session.findOne({ userId: userId });
};
