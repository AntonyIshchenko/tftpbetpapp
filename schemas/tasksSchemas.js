import Joi from 'joi';
import mongoose from 'mongoose';
import { backgrounds } from '../data/index.js';

const validBackgroundNames = ['', ...backgrounds.map(bg => bg.name)];

const validateObjectId = (fieldName, error) => {
  return Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': `Field ${fieldName} is required`,
      'string.empty': `Field ${fieldName} cannot be empty`,
    })
    .custom((id, obj) => {
      if (!mongoose.isValidObjectId(id)) {
        return obj.message(error);
      }
      return obj;
    });
};

const validateFutureDate = (value, helpers) => {
  const today = new Date();
  const inputDate = new Date(value);

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return helpers.message('Deadline date must be today or later');
  }
  return value;
};

const deadlineRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateDate = (date, checker) => {
  const dateParts = date.split('-');
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);

  if (month < 1 || month > 12) {
    return checker.message(`Month must be between 1 and 12`);
  }

  if (day < 1 || day > 31) {
    return checker.message(`Day must be between 1 and 31`);
  }

  return date;
};

// ------------ Board Joi Schema

export const createBoardSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Field name is required',
    'string.empty': 'Field name cannot be empty',
  }),
  icon: Joi.string().required().messages({
    'any.required': 'Set icon for Board',
    'string.empty': 'Field icon cannot be empty',
  }),
  background: Joi.string()
    .valid(...validBackgroundNames)
    .messages({
      'any.only': `Invalid value for field "background". Valid values are: ${validBackgroundNames.join(
        ', '
      )}`,
    }),
});
export const updateBoardSchema = Joi.object({
  name: Joi.string().trim(),
  icon: Joi.string(),
  background: Joi.string()
    .valid(...validBackgroundNames)
    .messages({
      'any.only': `Invalid value for field "background". Valid values are: ${validBackgroundNames.join(
        ', '
      )}`,
    }),
});

// ------------ Column Joi Schema
export const createColumnSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Field name is required',
    'string.empty': 'Field name cannot be empty',
  }),
  boardId: validateObjectId('board ID', 'Invalid board ID format'),
});

export const updateColumnSchema = Joi.object({
  name: Joi.string().trim().required(),
});

// ------------ Task Joi Schema

export const createTaskSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Field name is required',
    'string.empty': 'Field name cannot be empty',
  }),
  boardId: validateObjectId('board ID', 'Invalid board ID format'),
  columnId: validateObjectId('column ID', 'Invalid column ID format'),
  description: Joi.string().trim().allow(''),
  priority: Joi.string().valid('without', 'low', 'medium', 'high').messages({
    'any.only': 'Priority must be one of "without", "low", "medium", "high"',
  }),
  deadline: Joi.string()
    .required()
    .pattern(deadlineRegex)
    .message('Date must be in the format YYYY-MM-DD')
    .custom(validateDate)
    .custom(validateFutureDate),
});

export const updateTaskSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim().allow(''),
  priority: Joi.string().valid('without', 'low', 'medium', 'high'),
  deadline: Joi.string()
    .pattern(deadlineRegex)
    .message('Date must be in the format YYYY-MM-DD')
    .custom(validateDate)
    .custom(validateFutureDate),
});
