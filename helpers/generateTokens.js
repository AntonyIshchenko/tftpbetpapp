import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateTokens = (userId, sessionId) => {
  const accessToken = jwt.sign(
    { userId, sessionId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, sessionId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};
