import ctrlWrapper from '../helpers/ctrlWrapper.js';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/httpError.js';
import Session from '../schemas/sessionModel.js';
import { changeUser, findUser } from '../services/usersServices.js';

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw HttpError(400, 'Refresh token is required');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const session = await Session.findById(decoded.sessionId);

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

  const newAccessToken = jwt.sign(
    { userId: user._id, sessionId: newSession._id }, // userId tmp
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  const newRefreshToken = jwt.sign(
    { userId: user._id, sessionId: newSession._id }, // userId tmp
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  await changeUser({ _id: newSession.userId }, { token: newAccessToken });

  res.json({
    status: 'success',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
};

export default {
  refreshToken: ctrlWrapper(refreshToken),
};
