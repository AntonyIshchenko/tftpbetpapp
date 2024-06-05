const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      if (!error.status) error.message = 'Server error';
      next(error);
    }
  };
  return func;
};

export default ctrlWrapper;
