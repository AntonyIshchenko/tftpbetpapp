import { upload } from './upload.js';

export const handleContentType = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.single('avatar')(req, res, next);
  } else {
    next();
  }
};
