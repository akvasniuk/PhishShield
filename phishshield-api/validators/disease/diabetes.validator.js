const Joi = require('joi');

module.exports = Joi.object({
    pregnancies: Joi
        .number()
        .min(0)
        .max(17)
        .required(),
    glucose: Joi
        .number()
        .min(0)
        .max(200)
        .required(),
    bloodPressure: Joi
        .number()
        .min(0)
        .max(130)
        .required(),
    skinThickness: Joi
        .number()
        .min(0)
        .max(100)
        .required(),
    insulin: Joi
        .number()
        .min(0)
        .max(900)
        .required(),
    bmi: Joi
        .number()
        .min(0)
        .max(70)
        .required(),
    diabetesPedigreeFunction: Joi
        .number()
        .min(0)
        .max(3)
        .required(),
    age: Joi
        .number()
        .min(5)
        .max(150)
        .required(),
});