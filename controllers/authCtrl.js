import ctrlWrapper from '../helpers/ctrlWrapper.js';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/httpError.js';
import { changeUser, findUser } from '../services/usersServices.js';
import { generateTokens } from '../helpers/generateTokens.js';
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/sessionsServices.js';

const refreshTokens = async (req, res, next) => {
  // const { refreshToken } = req.body;

  const notAuthError = HttpError(401, 'Not authorized');

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw notAuthError;
  }

  const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw notAuthError;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw notAuthError;
  }

  const session = await findSession({ _id: decoded.sessionId });
  if (!session) {
    throw notAuthError;
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    throw notAuthError;
  }

  await deleteSession({ _id: decoded.sessionId });

  const newSession = await createSession({ userId: user._id });

  const { accessToken, refreshToken } = generateTokens(
    user._id,
    newSession._id
  );

  // const newAccessToken = tokens.accessToken.value;

  // const newAccessToken = tokens.accessToken;
  // const newRefreshToken = tokens.refreshToken;
  // const accessTokenExpiryDateUTC = tokens.accessTokenExpiresAt;
  // const refreshTokenExpiryDateUTC = tokens.refreshTokenExpiresAt;

  await changeUser({ _id: newSession.userId }, { token: accessToken });

  res.json({
    status: 'success',
    data: {
      accessToken,
      refreshToken,
    },
  });
};

export default {
  refreshTokens: ctrlWrapper(refreshTokens),
};
