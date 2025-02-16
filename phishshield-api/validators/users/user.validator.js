const Joi = require('joi');
const {Regexp} = require('../../constants');

module.exports = Joi.object({
    firstname: Joi
        .string()
        .required()
        .min(3)
        .max(40),
    lastname: Joi
        .string()
        .required()
        .min(3)
        .max(40),
    email: Joi
        .string()
        .regex(Regexp.EMAIL)
        .required(),
    password: Joi
        .string()
        .min(8)
        .max(256)
        .required(),
    avatar: Joi
        .string()
});
