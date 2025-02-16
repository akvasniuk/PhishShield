const Joi = require('joi');

module.exports = Joi.object({
    age: Joi
        .number()
        .min(10)
        .max(150)
        .required(),
    sex: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    cp: Joi
        .number()
        .min(0)
        .max(3)
        .required(),
    trestbps: Joi
        .number()
        .min(50)
        .max(200)
        .required(),
    chol: Joi
        .number()
        .min(100)
        .max(600)
        .required(),
    fbs: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    restecg: Joi
        .number()
        .min(0)
        .max(2)
        .required(),
    thalach: Joi
        .number()
        .min(60)
        .max(250)
        .required(),
    oldpeak: Joi
        .number()
        .min(0)
        .max(8)
        .required(),
    slope: Joi
        .number()
        .min(0)
        .max(2)
        .required(),
    ca: Joi
        .number()
        .min(0)
        .max(4)
        .required(),
    thal: Joi
        .number()
        .min(0)
        .max(2)
        .required(),
});