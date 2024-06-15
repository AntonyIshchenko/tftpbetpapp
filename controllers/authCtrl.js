import jwt from 'jsonwebtoken';
import queryString from 'query-string';

import { getUserResponseObject } from './userCtrl.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/httpError.js';
import Session from '../schemas/sessionModel.js';
import { changeUser, findUser, addUser } from '../services/usersServices.js';
import { generateTokens } from '../helpers/generateTokens.js';
import { findSession } from '../services/tokensServices.js';

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw HttpError(400, 'Refresh token is required');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const session = await Session.findById(decoded.sessionId);
  // const session = await findSession(decoded.sessionId); // так не працює (

  if (!session) {
    throw HttpError(401, 'Invalid refresh token');
  }

  const user = await findUser({ _id: session.userId });

  if (!user) {
    throw HttpError(401, 'User not found');
  }

  await Session.findByIdAndDelete(decoded.sessionId);

  const newSession = await Session.create({
    userId: user._id,
  });

  const tokens = generateTokens(user._id, newSession._id);
  const newAccessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;

  await changeUser({ _id: newSession.userId }, { token: newAccessToken });

  res.json({
    status: 'success',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
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
    user = await addUser({
      name: userData.name ? userData.name : userData.email.split('@')[0],
      email: userData.email,
      password: 'googleAuth',
      avatar: userData.picture ? userData.picture : null,
    });
  }

  const session = await Session.create({
    userId: user._id,
  });

  const { accessToken, refreshToken } = generateTokens(user._id, session._id);

  await changeUser({ _id: user._id }, { token: accessToken });

  const stringifiedParams = queryString.stringify({
    ...getUserResponseObject(user),
    accessToken: [...accessToken].join(' '),
    refreshToken: [...refreshToken].join(' '),
  });

  return res.redirect(`${process.env.FRONTEND_URL}?${stringifiedParams}`);
};

export default {
  refreshToken: ctrlWrapper(refreshToken),
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
};
