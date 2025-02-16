const Joi = require('joi');

module.exports = Joi.object({
    age: Joi
        .number()
        .min(5)
        .max(150)
        .required(),
    smokes: Joi
        .number()
        .min(0)
        .max(70)
        .required(),
    areaQ: Joi
        .number()
        .min(1)
        .max(10)
        .required(),
    alkohol: Joi
        .number()
        .min(0)
        .max(70)
        .required()
});