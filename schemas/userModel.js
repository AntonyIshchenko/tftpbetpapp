import { Schema, model } from 'mongoose';

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [32, 'Name must be at most 32 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [emailRegExp, 'Please enter a valid email address'], // RegExp треба уточнити!!!
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      maxlength: [64, 'Password must be at most 64 characters long'],
    },
    token: {
      type: String, //  [{}] - така штука не катить. Якщо масив об'эктів - інший підхід.
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'violet'],
      default: 'light',
    },
  },
  { versionKey: false }
);

export default model('User', userSchema);
