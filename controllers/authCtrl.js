import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import queryString from 'query-string';
import bcrypt from 'bcryptjs';

import ctrlWrapper from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';
import { getUserResponseObject } from './userCtrl.js';
import { changeUser, findUser, addUser } from '../services/usersServices.js';
import { generateTokens } from '../helpers/generateTokens.js';
import {
  createSession,
  deleteAllExceptCurrent,
  deleteSession,
  findSession,
  updateSession,
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

  await updateSession(
    { _id: newSession._id },
    { expiresAt: new Date(refreshToken.expiresAt) }
  );

  // const newAccessToken = tokens.accessToken.value;

  // const newAccessToken = tokens.accessToken;
  // const newRefreshToken = tokens.refreshToken;
  // const accessTokenExpiryDateUTC = tokens.accessTokenExpiresAt;
  // const refreshTokenExpiryDateUTC = tokens.refreshTokenExpiresAt;

  // await changeUser({ _id: newSession.userId }, { token: accessToken });

  res.json({
    status: 'success',
    data: {
      accessToken,
      refreshToken,
    },
  });
};

const closeAllSessions = async (req, res, next) => {
  const { id, userId } = req.session;
  const deletedSessions = await deleteAllExceptCurrent(userId, id);

  res.json({
    status: 'success',
    data: deletedSessions, // повертає масив видалених сессій.
  });
};

const googleAuth = async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BACKEND_URL}/api/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  const tokenDataResponse = await fetch(`https://oauth2.googleapis.com/token`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BACKEND_URL}/api/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    }),
  });

  if (tokenDataResponse.status !== 200) {
    throw HttpError(500, 'Internal Server Error');
  }
  const tokenData = await tokenDataResponse.json();

  const userDataResponse = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  if (userDataResponse.status !== 200) {
    throw HttpError(500, 'Internal Server Error');
  }
  const userData = await userDataResponse.json();

  let user = await findUser({ email: userData.email });
  if (!user) {
    const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);
    user = await addUser({
      name: userData.name ? userData.name : userData.email.split('@')[0],
      email: userData.email,
      password: passwordHash,
      avatar: userData.picture ? userData.picture : null,
      oauth: true,
    });
  }

  const session = await createSession({ userId: user._id });

  const { accessToken, refreshToken } = generateTokens(user._id, session._id);

  await updateSession(
    { _id: session._id },
    { expiresAt: new Date(refreshToken.expiresAt) }
  );

  const stringifiedParams = queryString.stringify({
    accessToken: JSON.stringify(accessToken),
    refreshToken: JSON.stringify(refreshToken),
  });

  return res.redirect(`${process.env.FRONTEND_URL}?${stringifiedParams}`);
};

export default {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
  refreshTokens: ctrlWrapper(refreshTokens),
  closeAllSessions: ctrlWrapper(closeAllSessions),
};
