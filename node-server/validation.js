const Joi = require('@hapi/joi');

const nameMessages = {
    invalid: 'Please enter a valid full name.',
    tooShort: 'The full name should be 6 characters or longer.'
}

const emailMessages = {
    invalid: 'Please enter a valid email address.',
    tooShort: 'The email address should be 6 characters or longer.'
}

const passwordMessages = {
    invalid: 'Please enter a valid password.',
    tooShort: 'The password should be 6 characters or longer.'
}

const registerValidation = (data) => {

    const schema = Joi.object({
        name: Joi.string().min(6).required().messages({
            'any.required': nameMessages.invalid,
            'string.base': nameMessages.invalid,
            'string.empty': nameMessages.invalid,
            'string.min': nameMessages.tooShort
        }),
        email: Joi.string().min(6).required().email().messages({
            'any.required': emailMessages.invalid,
            'string.base': emailMessages.invalid,
            'string.empty': emailMessages.invalid,
            'string.email': emailMessages.invalid,
            'string.min': emailMessages.tooShort
        }),
        password: Joi.string().min(6).required().messages({
            'any.required': passwordMessages.invalid,
            'string.base': passwordMessages.invalid,
            'string.empty': passwordMessages.invalid,
            'string.min': passwordMessages.tooShort
        }),
        id: Joi.string(),
        verification: Joi.string()
    });
    
    return schema.validate(data);
};

const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(6).required().email().messages({
            'any.required': emailMessages.invalid,
            'string.base': emailMessages.invalid,
            'string.empty': emailMessages.invalid,
            'string.email': emailMessages.invalid,
            'string.min': emailMessages.tooShort
        }),
        password: Joi.string().min(6).required().messages({
            'any.required': passwordMessages.invalid,
            'string.base': passwordMessages.invalid,
            'string.empty': passwordMessages.invalid,
            'string.min': passwordMessages.tooShort
        })
    });
    
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;