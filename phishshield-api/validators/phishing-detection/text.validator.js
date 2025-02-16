const Joi = require('joi');

module.exports = Joi
    .string()
    .min(10)
    .required();
