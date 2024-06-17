import HttpError from '../helpers/httpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { addUser, findUser, changeUser } from '../services/usersServices.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as fs from 'node:fs/promises';
import cloudinary from '../helpers/cloudinaryConfig.js';
import sizeOf from 'image-size';

import transporter from '../helpers/mail.js';

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
  const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  await changeUser({ email: emailInLowerCase }, { token });
  res.json({
    status: 'success',
    data: {
      user: getUserResponseObject(existUser),
      token: token,
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

const sendHelpEmail = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, 'Body must have at least one field');

  const { email, comment } = req.body;

  const mailOptionsToUser = {
    from: process.env.GMAIL_USER, //Адреса, з якої відправляється лист про допомог
    to: email, //Використовуємо email з req.body як відправника
    subject: 'Customer Support Request',
    html: `
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid grey; padding: 15px; color: black; font-family: 'Courier New', Courier, monospace; border-radius: 12px;">
      <h1 style="background: grey; color: white; padding: 8px; text-align: center; border-radius: 12px;">
      Greetings, dear user!
      </h1>
        <p>
          ${email}
        </p>
        <p>
        <b>Thank you for reaching out to us. We have received your request and it has been successfully forwarded to our technical support team for review. Please expect a response from us very soon!</b>
        <br><br>
        We appreciate your patience and trust in our TaskPro service. If you have any further questions or concerns, feel free to reach out to us anytime.
        <br><br>
        <b>Issue Description:</b>
        <br>
        <span style="font-style: italic; color: #808080; text-decoration: none;">"${comment}"</span>
        <br><br>
        Best regards,
        <br>
        <b>TaskPro ⚙️</b>
      </p>
      <img src="https://i.gifer.com/6vw5.gif" alt="Animation" style="display: block; width: 30%; height: 30%;">
    </div>`,
    text: `We have registered your request with our support team.Please expect a response soon!: ${comment}`
  }


  const mailOptionsToService = {
    from: process.env.GMAIL_USER, //адреса з якої відправляється листи до служби підтримки
    to: process.env.CUSTOMER_SERVICE, // адреса служби підтримки
    subject: 'Customer Help Request',
    html: `
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid grey; padding: 15px; color: black; font-family: 'Courier New', Courier, monospace; border-radius: 12px;">
      <h1 style="background: grey; color: white; padding: 8px; text-align: center; border-radius: 12px;">Hello Support Team</h1>
        <p>I hope this message finds you well. I am     reaching out because I am experiencing an issue with your service. Below are the details of the problem I am facing:</p>
        <p><b>User Information:</b>
        <br>
        <b>Email:</b> ${email}
        <br><br>
        <b>Issue Description:</b>
        <br>
        <span style="font-style: italic;">"${comment}"</span>
        <br><br>
        I would greatly appreciate it if you could look into this matter and provide assistance at your earliest convenience. Thank you for your prompt attention to this issue.
        <br><br>
        Best regards,
        <br>
        Your non-toxic client🪂
      </p>
    <img src="https://i.gifer.com/yH.gif" alt="Animation" style="display: block; width: 30%; height: 30%;">
  </div>`,
    text: `User with email ${email} has problem : ${comment}`,
  }


  await transporter.sendMail(mailOptionsToUser);
  await transporter.sendMail(mailOptionsToService);

  res.json({ status: 'success', data: null });
}

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateUser: ctrlWrapper(updateUser),
  getCurrentUser,
  sendHelpEmail: ctrlWrapper(sendHelpEmail)
};


