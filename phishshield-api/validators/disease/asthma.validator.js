const Joi = require('joi');

module.exports = Joi.object({
    tiredness: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    dry_cough: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    none_symptom: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    pains: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    nasal_congestion: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    none_experiening: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age_0_9: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    dry_cough: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age_10_19: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age_20_24: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age_25_59: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    age_60_more: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    gender_female: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    gender_male: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    severity_mild: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    severity_moderate: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    severity_none: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
});