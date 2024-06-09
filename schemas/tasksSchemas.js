import Joi from "joi";

// ------------ Board Joi Schema
export const createBoardSchema = Joi.object({
    name: Joi.string().min(2).max(32).required().messages({
        'any.required': 'Field "name" is required',
        'string.empty': 'Field "name" cannot be empty',
        'string.min': 'Field "name" must be at least 2 characters long',
        'string.max': 'Field "name" must be at most 32 characters long',
    }),
    owner: Joi.string().hex().length(24).messages({
        'string.hex': 'Invalid owner ID format',
        'string.lenght': 'Invalid owner ID lenght'
    }),
    icon: Joi.string().required().messages({
        'any.required': 'Set icon for board',
        'string.empty': 'Field "icon" cannot be empty'
    }),
    background: Joi.object({
        type: Joi.string().optional(),
        url: Joi.string().optional()
    })
});

export const updateBoardSchema = Joi.object({
    name: Joi.string().min(2).max(32),
    icon: Joi.string(),
    background: Joi.object({
        type: Joi.string().optional(),
        url: Joi.string().optional()
    })
});

// ------------ Column Joi Schema
export const createColumnSchema = Joi.object({
    name: Joi.string().min(2).max(32).required().messages({
        'any.required': 'Field "name" is required',
        'string.empty': 'Field "name" cannot be empty',
        'string.min': 'Field "name" must be at least 2 characters long',
        'string.max': 'Field "name" must be at most 32 characters long',
    }),
    boardId: Joi.string().hex().length(24).messages({
        'string.hex': 'Invalid owner ID format',
        'string.lenght': 'Invalid owner ID lenght'
    })
});



