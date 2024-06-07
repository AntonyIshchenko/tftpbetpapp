import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { addUser, findUser, changeUser } from '../services/usersServices.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const getUserResponseObject = user => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    theme: user.theme,
    avatar: user.avatar,
  };
};

// Register + Joi OK
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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
  const updatedUser = await changeUser({ _id: user._id }, { token });
  res.status(201).json({
    status: 'success',
    data: {
      user: getUserResponseObject(updatedUser),
      token: token,
    },
  });
};

const getCurrentUser = (req, res, next) => {
  const userResponse = getUserResponseObject(req.user);
  res.status(201).json({
    status: 'success',
    data: {
      user: userResponse,
    },
  });
};

// Login + Joi OK

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
  const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  await changeUser({ email: emailInLowerCase }, { token });
  res.status(201).json({
    status: 'success',
    data: {
      user: getUserResponseObject(existUser),
      token: token,
    },
  }); //  Все, крім пароля
};

// Логаут ОК

const logoutUser = async (req, res, next) => {
  const { id } = req.user;
  const updatedUser = await changeUser({ _id: id }, { token: null });
  if (!updatedUser) {
    throw HttpError(404, 'User not found');
  }
  res.sendStatus(204); // нічого не повертає, крім статусу
};

// Тема + Joi OK

const modifyUserTheme = async (req, res, next) => {
  const { id } = req.params;
  const result = await changeUser({ _id: id }, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({
    status: 'success',
    data: {
      theme: result.theme,
    },
  }); // повертає тему
};

// update + Joi OK

const updateUser = async (req, res, next) => {
  const { id } = req.user;
  const { name, email, password, avatar } = req.body;
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
  if (avatar) {
    updates.avatar = avatar;
  }
  const updatedUser = await changeUser({ _id: id }, updates);
  if (!updatedUser) {
    throw HttpError(404, 'User not found');
  }
  res.status(200).json(getUserResponseObject(updatedUser));
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  modifyUserTheme: ctrlWrapper(modifyUserTheme),
  updateUser: ctrlWrapper(updateUser),
  getCurrentUser,
};
