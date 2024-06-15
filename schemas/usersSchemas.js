import Joi from 'joi';

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(32).required().messages({
    'any.required': 'Field "name" is required',
    'string.empty': 'Field "name" cannot be empty',
    'string.min': 'Field "name" must be at least 2 characters long',
    'string.max': 'Field "name" must be at most 32 characters long',
  }),
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .pattern(emailRegExp)
    .messages({
      'any.required': 'Field "email" is required',
      'string.empty': 'Field "email" cannot be empty',
      'string.email': 'Field "email" must be a valid email address',
      'string.pattern.base':
        'Email must be a valid email address. For example: example@domain.com',
    }),
  password: Joi.string().min(8).max(64).required().messages({
    'any.required': 'Field "password" is required',
    'string.empty': 'Field "password" cannot be empty',
    'string.min': 'Field "password" must be at least 8 characters long',
    'string.max': 'Field "password" must be at most 64 characters long',
  }),
  theme: Joi.string().valid('light', 'dark', 'violet').messages({
    'any.only': 'Theme must be one of "light", "dark", or "violet"',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'any.required': 'Field "email" is required',
    'string.empty': 'Field "email" cannot be empty',
    'string.email': 'Field "email" must be a valid email address',
  }),
  password: Joi.string().min(8).max(64).required().messages({
    'any.required': 'Field "password" is required',
    'string.empty': 'Field "password" cannot be empty',
    'string.min': 'Field "password" must be at least 8 characters long',
    'string.max': 'Field "password" must be at most 64 characters long',
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(32),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(64),
  avatar: Joi.string(), // деталі
  theme: Joi.string().valid('light', 'dark', 'violet').messages({
    'any.only': 'Theme must be one of "light", "dark", or "violet"',
  }),
});

export const mailOptionsToUserSchema = Joi.object({
  email: Joi.string().email().trim().required().pattern(emailRegExp).messages({
    'string.email': 'Invalid email format. For example: example@domain.com',
    'string.pattern.base':
      'Email must be a valid email address. For example: example@domain.com',
    'string.empty': 'Email field cannot be empty.',
    'any.required': 'Email is required.',
  }),
  comment: Joi.string().trim().required().messages({
    'string.empty': 'Comment field cannot be empty.',
    'any.required': 'Comment is required.',
  }),
});
