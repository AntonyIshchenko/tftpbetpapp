import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { addUser, findUser, changeUser } from '../services/usersServices.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as fs from 'node:fs/promises';
import cloudinary from '../helpers/cloudinaryConfig.js';
import sizeOf from 'image-size';
import Session from '../schemas/sessionModel.js';

const getUserResponseObject = user => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    theme: user.theme,
    avatar: user.avatar,
  };
};

const checkImageSize = async filePath => {
  const data = await fs.readFile(filePath);
  const dimensions = sizeOf(data);
  return dimensions;
};

const registerUser = async (req, res, next) => {
  const { name, email, password, theme } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const existUser = await findUser({ email: emailInLowerCase });
  if (existUser !== null) {
    throw HttpError(409, 'Email in use');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const validThemes = ['light', 'dark', 'violet'];
  const userTheme = validThemes.includes(theme) ? theme : 'light';
  const userData = {
    name,
    email: emailInLowerCase,
    password: passwordHash,
    theme: userTheme,
  };
  const user = await addUser(userData);

  const newSession = await Session.create({
    userId: user._id,
  });

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: newSession._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, sessionId: newSession._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
  const updatedUser = await changeUser(
    { _id: user._id },
    { token: accessToken }
  );
  res.status(201).json({
    status: 'success',
    data: {
      user: getUserResponseObject(updatedUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

const getCurrentUser = (req, res, next) => {
  const userResponse = getUserResponseObject(req.user);
  res.json({
    status: 'success',
    data: {
      user: userResponse,
    },
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const existUser = await findUser({ email: emailInLowerCase });
  if (existUser === null) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const isMatch = await bcrypt.compare(password, existUser.password);
  if (!isMatch) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const newSession = await Session.create({
    userId: existUser._id,
  });

  const accessToken = jwt.sign(
    { userId: existUser._id, sessionId: newSession._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  const refreshToken = jwt.sign(
    { userId: existUser._id, sessionId: newSession._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  await changeUser({ email: emailInLowerCase }, { token: accessToken });
  res.json({
    status: 'success',
    data: {
      user: getUserResponseObject(existUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

const logoutUser = async (req, res, next) => {
  const { id } = req.user;
  const updatedUser = await changeUser({ _id: id }, { token: null });
  if (!updatedUser) {
    throw HttpError(404, 'User not found');
  }
  res.json({
    status: 'success',
    data: null,
  });
};

const updateUser = async (req, res, next) => {
  const { id } = req.user;
  const { name, email, password, theme } = req.body;
  const updates = {};

  if (name) {
    updates.name = name;
  }

  if (email) {
    const emailInLowerCase = email.toLowerCase();
    const existUser = await findUser({ email: emailInLowerCase });
    if (existUser !== null && existUser._id.toString() !== id) {
      throw HttpError(409, 'Email in use');
    }
    updates.email = emailInLowerCase;
  }

  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }

  if (theme) {
    updates.theme = theme;
  }

  if (req.file) {
    try {
      const dimensions = await checkImageSize(req.file.path);
      const uploadOptions = { folder: 'avatars' };

      if (dimensions && dimensions.width >= 200 && dimensions.height >= 200) {
        uploadOptions.transformation = [
          { width: 200, height: 200, crop: 'fill' },
        ];
      }

      const result = await cloudinary.uploader.upload(
        req.file.path,
        uploadOptions
      );
      updates.avatar = result.secure_url;
      updates.avatarPublicId = result.public_id;

      if (req.user.avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(req.user.avatarPublicId);
        } catch (error) {
          // we don't think that error should stop our flow
        }
      }
      await fs.unlink(req.file.path);
    } catch (error) {
      await fs.unlink(req.file.path);
      throw HttpError(500, 'Error uploading image');
    }
  }

  if (Object.keys(updates).length === 0) {
    throw HttpError(400, 'No fields to update');
  }

  const updatedUser = await changeUser({ _id: id }, updates);
  if (!updatedUser) {
    throw HttpError(404, 'User not found');
  }
  res.json({
    status: 'success',
    data: {
      user: getUserResponseObject(updatedUser),
    },
  });
};

const refreshToken = (req, res, next) => {
  res.json('Refresh');
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateUser: ctrlWrapper(updateUser),
  refreshToken: ctrlWrapper(refreshToken),
  getCurrentUser,
};
