const Joi = require('joi');
const {Regexp} = require('../../constants');

module.exports = Joi.object({
    glucoseLevel: Joi
        .number()
        .required()
        .min(10)
        .max(200),
    height: Joi
        .number()
        .required()
        .min(50)
        .max(260),
    weight: Joi
        .number()
        .min(20)
        .max(300)
        .required(),
    bloodPressure: Joi
        .string()
        .required(),
    stepCount: Joi
        .number()
        .min(0)
        .max(1000000)
        .required(),
    heartRate: Joi
        .number()
        .min(10)
        .max(300)
        .required(),
    bodyFat: Joi
        .number()
        .min(1)
        .max(300)
        .required(),
});
