import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

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
  fileSize: 5 * 1024 * 1024, // 5 MB
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({
      statusCode: 400,
      message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
    });
  }
};

const upload = multer({ storage, limits, fileFilter });

export { upload };
