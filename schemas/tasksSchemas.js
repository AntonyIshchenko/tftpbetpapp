import Joi from "joi";
import mongoose from "mongoose";


const validateObjectId = (fieldName, error) => {
    return Joi.string().required().messages({
        'any.required': `Field ${fieldName} is required`
    }).custom((id, obj) => {
        if (!mongoose.isValidObjectId(id)) {
            return obj.message(error);
        }
        return obj;
    });
};

const deadlineRegex = /^\d{4}-\d{2}-\d{2}$/;

// ------------ Board Joi Schema
export const createBoardSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Field name is required',
        'string.empty': 'Field name cannot be empty',
    }),
    owner: Joi.string().custom((id, obj) => {
        if (!mongoose.isValidObjectId(id)) {
            return obj.message('Invalid owner ID format');
        }
        return obj;
    }),
    icon: Joi.string().required().messages({
        'any.required': 'Set icon for Board',
        'string.empty': 'Field icon cannot be empty'
    }),
    background: Joi.string().optional()
});

export const updateBoardSchema = Joi.object({
    name: Joi.string(),
    icon: Joi.string(),
    background: Joi.string().optional()
});

// ------------ Column Joi Schema
export const createColumnSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Field name is required',
        'string.empty': 'Field name cannot be empty',
    }),
    boardId: validateObjectId('board ID', 'Invalid board ID format')
});

export const updateColumnSchema = Joi.object({
    name: Joi.string(),
});

// ------------ Task Joi Schema

export const createTaskSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Field name is required',
        'string.empty': 'Field name cannot be empty',
    }),
    boardId: validateObjectId('board ID', 'Invalid board ID format'),
    columnId: validateObjectId('column ID', 'Invalid column ID format'),
    description: Joi.string().optional(),
    priority: Joi.string().valid('without', 'low', 'medium', 'high').messages({
        'any.only': 'Priority must be one of "without", "low", "medium", "high"'
    }),
    deadline: Joi.string().allow('').required().pattern(deadlineRegex)
});

export const updateTaskSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    priority: Joi.string().valid('without', 'low', 'medium', 'high'),
    deadline: Joi.string().allow('').required().pattern(deadlineRegex)
});


