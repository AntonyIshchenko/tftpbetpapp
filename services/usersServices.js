import User from '../schemas/userModel.js';

export const findUser = data => User.findOne(data);

export const addUser = data => User.create(data);

export const changeUser = (userData, changesData) =>
  User.findOneAndUpdate(userData, changesData, { new: true });
