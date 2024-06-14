import ctrlWrapper from '../helpers/ctrlWrapper.js';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/httpError.js';
import { changeUser, findUser } from '../services/usersServices.js';
import { generateTokens } from '../helpers/generateTokens.js';
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/tokensServices.js';

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw HttpError(400, 'Refresh token is required');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const session = await findSession(decoded.sessionId);

  if (!session) {
    throw HttpError(401, 'Invalid refresh token');
  }

  const user = await findUser({ _id: session.userId });

  if (!user) {
    throw HttpError(401, 'User not found');
  }

  await deleteSession(decoded.sessionId);

  const newSession = await createSession(user._id);

  const tokens = generateTokens(user._id, newSession._id);
  const newAccessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;
  const accessTokenExpiryDateUTC = tokens.accessTokenExpiresIn;
  const refreshTokenExpiryDateUTC = tokens.refreshTokenExpiresIn;

  console.log(accessTokenExpiryDateUTC);

  await changeUser({ _id: newSession.userId }, { token: newAccessToken });

  res.json({
    status: 'success',
    data: {
      accessToken: {
        value: newAccessToken,
        expiresIn: accessTokenExpiryDateUTC,
      },
      refreshToken: {
        value: newRefreshToken,
        expiresIn: refreshTokenExpiryDateUTC,
      },
    },
  });
};

export default {
  refreshToken: ctrlWrapper(refreshToken),
};
