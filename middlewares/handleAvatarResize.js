import cloudinary from './cloudinaryConfig.js';

const handleAvatarResize = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded.' });
  }
  cloudinary.uploader
    .upload(req.file.path, {
      transformation: [{ width: 200, height: 200, crop: 'fill' }], // crop, fit - різні обрізки. філ самий норм
      folder: 'avatars',
    })
    .then(result => {
      req.cloudinaryResult = result;
      next();
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error processing image.' });
    });
};

export default handleAvatarResize;
