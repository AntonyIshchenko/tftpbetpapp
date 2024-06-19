import jwt from 'jsonwebtoken';
import 'dotenv/config';
import ms from 'ms';

export const generateTokens = (userId, sessionId) => {
  const currentTime = Date.now();

  const accessTokenExpiresAtMs = ms(process.env.ACCESS_TOKEN_EXPIRES_IN);
  const refreshTokenExpiresAtMs = ms(process.env.REFRESH_TOKEN_EXPIRES_IN);

  const accessTokenExpiryDateUTC = new Date(
    currentTime + accessTokenExpiresAtMs
  ).toISOString();
  const refreshTokenExpiryDateUTC = new Date(
    currentTime + refreshTokenExpiresAtMs
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

  // return {
  //   accessToken,
  //   refreshToken,
  //   accessTokenExpiresAt: accessTokenExpiryDateUTC,
  //   refreshTokenExpiresAt: refreshTokenExpiryDateUTC,
  // };

  return {
    accessToken: { value: accessToken, expiresAt: accessTokenExpiryDateUTC },
    refreshToken: { value: refreshToken, expiresAt: refreshTokenExpiryDateUTC },
  };
};
