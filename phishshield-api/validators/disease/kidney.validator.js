const Joi = require('joi');

module.exports = Joi.object({
    age: Joi
        .number()
        .min(3)
        .max(150)
        .required(),
    bp: Joi
        .number()
        .min(40)
        .max(200)
        .required(),
    sg: Joi
        .number()
        .min(1)
        .max(1.03)
        .required(),
    al: Joi
        .number()
        .min(0)
        .max(6)
        .required(),
    su: Joi
        .number()
        .min(0)
        .max(10)
        .required(),
    pcc: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    ba: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    bgr: Joi
        .number()
        .min(20)
        .max(500)
        .required(),
    bu: Joi
        .number()
        .min(1)
        .max(400)
        .required(),
    sc: Joi
        .number()
        .min(0)
        .max(80)
        .required(),
    hemo: Joi
        .number()
        .min(3)
        .max(20)
        .required(),
    htn: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    dm: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    cad: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    appet: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    pe: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
    ane: Joi
        .number()
        .min(0)
        .max(1)
        .required(),
});