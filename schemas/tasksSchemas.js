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
    boardId: Joi.string().hex().length(24).required().messages({
        'any.required': 'Field "boardId" is required',
        'string.hex': 'Invalid owner ID format',
        'string.lenght': 'Invalid owner ID lenght'
    })
});

export const updateColumnSchema = Joi.object({
    name: Joi.string().min(2).max(32),
});

// ------------ Task Joi Schema

export const createTaskSchema = Joi.object({
    name: Joi.string().min(2).max(32).required().messages({
        'any.required': 'Field "name" is required',
        'string.empty': 'Field "name" cannot be empty',
        'string.min': 'Field "name" must be at least 2 characters long',
        'string.max': 'Field "name" must be at most 32 characters long',
    }),
    boardId: Joi.string().hex().length(24).required().messages({
        'any.required': 'Field "boardId" is required',
        'string.hex': 'Invalid owner ID format',
        'string.length': 'Invalid owner ID length'
    }),
    columnId: Joi.string().hex().length(24).required().messages({
        'any.required': 'Field "columnId" is required',
        'string.hex': 'Invalid owner ID format',
        'string.length': 'Invalid owner ID length'
    }),
    description: Joi.string().min(2).max(32).optional(),
    priority: Joi.string().valid('without', 'low', 'medium', 'high').messages({
        'any.only': 'Priority must be one of "without", "low", "medium", "high"'
    }),
    deadline: Joi.string().allow('').optional(),
});

export const updateTaskSchema = Joi.object({
    name: Joi.string().min(2).max(32),
    description: Joi.string().min(2).max(32),
    priority: Joi.string().valid('without', 'low', 'medium', 'high'),
});


