const Joi = require('joi');

module.exports = Joi.object({
    gender: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    educ: Joi
        .number()
        .min(0)
        .max(30)
        .required(),
    ses: Joi
        .number()
        .min(0)
        .max(5)
        .required(),
    mmse: Joi
        .number()
        .min(16)
        .max(30)
        .required(),
    etiv: Joi
        .number()
        .min(1100)
        .max(2000)
        .required(),
    nwbv: Joi
        .number()
        .min(0.6)
        .max(0.9)
        .required(),
    asf: Joi
        .number()
        .min(0.8)
        .max(1.6)
        .required(),
});