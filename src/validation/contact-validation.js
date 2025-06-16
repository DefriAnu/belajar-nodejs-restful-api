import Joi from "joi";

const createContactValidation = Joi.object({
    first_name : Joi.string().max(100).required(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).required(),
    phone : Joi.string().max(20).optional(),
});

const getContactValidation = Joi.number().positive().required();

const updateContactValidation = Joi.object({
    first_name : Joi.string().max(100).optional(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).optional(),
    phone : Joi.string().max(20).optional(),
});

const paramsContactValidation = Joi.object({
    size : Joi.number().positive().min(1).optional().default(10),
    page : Joi.number().positive().min(1).optional().default(1),
    name : Joi.string().optional(),
    email : Joi.string().optional(),
    phone : Joi.string().optional()
});

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    paramsContactValidation
};