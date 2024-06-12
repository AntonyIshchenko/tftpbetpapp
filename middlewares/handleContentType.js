import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import HttpError from '../helpers/httpError.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('tmp'));
  },
  filename: (req, file, callback) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();
    const fileName = `${basename}-${suffix}${extname}`;
    callback(null, fileName);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      HttpError(
        400,
        'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.'
      )
    );
  }
};

const upload = multer({ storage, limits, fileFilter });

export const handleContentType = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.single('avatar')(req, res, async err => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            HttpError(400, 'File size too large. Maximum size is 5MB.')
          );
        }
      } else if (err) {
        return next(err);
      }

      if (!req.file) {
        return next(HttpError(400, 'No file uploaded.'));
      }

      next();
    });
  } else {
    next();
  }
};
