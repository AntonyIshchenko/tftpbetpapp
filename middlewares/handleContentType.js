import multer from 'multer';
import { upload } from './upload.js';

export const handleContentType = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.single('avatar')(req, res, err => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res
            .status(400)
            .json({ message: 'File size too large. Maximum size is 5MB.' });
        }
      } else if (err) {
        return next(err);
      }
      next();
    });
  } else {
    next();
  }
};
