import Joi from "joi";
import mongoose from "mongoose";

const validateObjectId = (fieldName, error) => {
    return Joi.string().required().trim().messages({
        'any.required': `Field ${fieldName} is required`,
        'string.empty': `Field ${fieldName} cannot be empty`,
    }).custom((id, obj) => {
        if (!mongoose.isValidObjectId(id)) {
            return obj.message(error);
        }
        return obj;
    });
};

const validateDate = (fieldDate) => {
    return Joi.string().required().messages({
        'any.required': `Field ${fieldDate} is required`,
        'string.empty': `Field ${fieldDate} cannot be empty`,
    }).custom((date, checker) => {
        const deadlineRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!deadlineRegex.test(date)) {
            return checker.message(`Date must be in the format YYYY-MM-DD`);
        }

        const [month, day] = date.split('-').map(Number);

        if (month < 1 || month > 12) {
            return checker.message(`Month must be between 1 and 12`);
        }

        if (day < 1 || day > 31) {
            return checker.message(`Day must be between 1 and 31`)
        }

        return date;
    });
};


// ------------ Board Joi Schema
export const createBoardSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Field name is required',
        'string.empty': 'Field name cannot be empty',
    }),
    owner: validateObjectId('owner ID', 'Invalid owner ID format'),
    icon: Joi.string().required().messages({
        'any.required': 'Set icon for Board',
        'string.empty': 'Field icon cannot be empty'
    }),
    background: Joi.string().allow('')
});

export const updateBoardSchema = Joi.object({
    name: Joi.string().trim(),
    icon: Joi.string(),
    background: Joi.string().allow('')
});

// ------------ Column Joi Schema
export const createColumnSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Field name is required',
        'string.empty': 'Field name cannot be empty',
    }),
    boardId: validateObjectId('board ID', 'Invalid board ID format')
});

export const updateColumnSchema = Joi.object({
    name: Joi.string().trim().required()
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
        'any.only': 'Priority must be one of "without", "low", "medium", "high"'
    }),
    deadline: validateDate('deadline', 'Invalid date format or values out of range')
});

export const updateTaskSchema = Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim().allow(''),
    priority: Joi.string().valid('without', 'low', 'medium', 'high'),
    deadline: validateDate('deadline', 'Invalid date format or values out of range')
});


