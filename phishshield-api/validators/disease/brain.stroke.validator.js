const Joi = require('joi');

module.exports = Joi.object({
    gender: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age_elderly: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    ascites: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    hepatomegaly: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    spiders: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    edema: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    bilirubin_high: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    copper_high: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    prothrombin_normal: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
});