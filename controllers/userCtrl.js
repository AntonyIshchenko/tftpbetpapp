import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { addUser, findUser, changeUser } from '../services/usersServices.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Register + Joi OK

// або токен утворюється з імейлу, або додатковий запит дл БД.

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const existUser = await findUser({ email: emailInLowerCase });
  if (existUser !== null) {
    throw HttpError(409, 'Email in use');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const token = jwt.sign({ id: emailInLowerCase }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  const userData = {
    name,
    email: emailInLowerCase,
    password: passwordHash,
    token,
  };
  const user = await addUser(userData);
  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
};

// Login + Joi OK

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const existUser = await findUser({ email: emailInLowerCase });
  if (existUser === null) {
    throw HttpError(409, 'Email not found');
  }
  const isMatch = await bcrypt.compare(password, existUser.password);
  if (!isMatch) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  await changeUser({ email: emailInLowerCase }, { token });
  res.status(200).json(token); // повертаем тільки токен, чи весь юзер?
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
  const result = await changeUser({ _id: id }, req.body); // joi міняєм тему
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result); // повертає всього юзера
};

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
    if (existUser !== null) {
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
  res.status(200).json(updatedUser);
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  modifyUserTheme: ctrlWrapper(modifyUserTheme),
  updateUser: ctrlWrapper(updateUser),
};
