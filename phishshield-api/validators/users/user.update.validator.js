const Joi = require('joi');
const {Regexp} = require('../../constants');

module.exports = Joi.object({
    firstname: Joi
        .string()
        .min(3)
        .max(40),
    lastname: Joi
        .string()
        .min(3)
        .max(40),
    email: Joi
        .string()
        .regex(Regexp.EMAIL),
    password: Joi
        .string()
        .min(8)
        .max(256),
    avatar: Joi
        .string(),
    role: Joi
        .string(),
    isUserActivated: Joi
        .boolean()
});
