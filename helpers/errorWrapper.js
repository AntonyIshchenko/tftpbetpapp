const errorWrapper = error => {
  const err = new Error();

  err.statusCode = error.statusCode || 500;
  err.status = error.status || 'error';
  err.message = error.message || 'Internal Server Error';

  return err;
};

export default errorWrapper;
