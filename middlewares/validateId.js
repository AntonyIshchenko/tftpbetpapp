import mongoose from 'mongoose';
import HttpError from '../helpers/httpError.js';

const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    next(HttpError(404, 'Not found'));
  } else {
    next();
  }
};

export default isValidId;
