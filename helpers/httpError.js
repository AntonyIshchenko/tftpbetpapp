const HttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = statusCode >= 500 ? 'error' : 'fail';

  return error;
};

export default HttpError;
