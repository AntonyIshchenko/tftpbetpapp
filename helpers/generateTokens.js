import jwt from 'jsonwebtoken';
import 'dotenv/config';
import ms from 'ms';

export const generateTokens = (userId, sessionId) => {
  const currentTime = Date.now();

  const accessTokenExpiresInMs = ms(process.env.ACCESS_TOKEN_EXPIRES_IN);
  const refreshTokenExpiresInMs = ms(process.env.REFRESH_TOKEN_EXPIRES_IN);

  const accessTokenExpiryDateUTC = new Date(
    currentTime + accessTokenExpiresInMs
  ).toISOString();
  const refreshTokenExpiryDateUTC = new Date(
    currentTime + refreshTokenExpiresInMs
  ).toISOString();

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

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: accessTokenExpiryDateUTC,
    refreshTokenExpiresIn: refreshTokenExpiryDateUTC,
  };
};
