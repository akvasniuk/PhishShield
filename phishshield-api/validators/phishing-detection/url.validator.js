const Joi = require('joi');

module.exports = Joi
    .string()
    .uri()
    .required();
