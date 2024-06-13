import HttpError from '../helpers/httpError.js';
import jwt from 'jsonwebtoken';
import User from '../schemas/userModel.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

export const authMiddleware = ctrlWrapper(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw HttpError(401, 'Not authorized');
  }

  const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer') {
    throw HttpError(401, 'Not authorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId);
    if (user === null || user.token !== token) {
      throw HttpError(401, 'Not authorized');
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
});

export default authMiddleware;
