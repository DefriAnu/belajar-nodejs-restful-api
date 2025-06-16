import Joi from "joi";

const registeredUserValidation = Joi.object({
    username : Joi.string().min(1).max(100).required(),
    password : Joi.string().min(1).max(100).required(),
    name: Joi.string().min(1).max(100).required()
});

const loginUserValidation = Joi.object({
    username : Joi.string().min(1).max(100).required(),
    password : Joi.string().min(1).max(100).required()
});

const getUserValidation = Joi.string().min(1).max(100).required();

const updateUserValidation = Joi.object({
    username : Joi.string().min(1).max(100).required(),
    password : Joi.string().min(1).max(100).optional(),
    name : Joi.string().min(1).max(100).optional()
});

export {
    registeredUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
};