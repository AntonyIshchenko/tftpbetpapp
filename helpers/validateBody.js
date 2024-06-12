import HttpError from './httpError.js';

const validateBody = (schema, sanytize = false) => {
  const func = (req, _, next) => {
    const { error, value } = schema.validate(req.body, { convert: true });
    if (error) {
      next(HttpError(400, error.message));
    }
    if (sanytize) req.body = { ...value };
    next();
  };

  return func;
};

export default validateBody;
