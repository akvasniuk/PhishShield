const Joi = require('joi');

module.exports = Joi.object({
    stage: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age: Joi
        .number()
        .min(5)
        .max(150)
        .required(),
    hypertension: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    heart_disease: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    work_type: Joi
        .number()
        .min(0)
        .max(3)
        .required(),
    residence_type: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    bmi: Joi
        .number()
        .min(0)
        .max(70)
        .required(),
    smoking_status: Joi
        .number()
        .min(0)
        .max(2)
        .required(),
});