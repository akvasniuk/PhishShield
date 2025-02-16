const Joi = require('joi');

module.exports = Joi.object({
    comment: Joi
        .string()
        .required(),
    username: Joi
        .string()
        .required()
        .min(3),
});
