const Joi = require('joi');

module.exports = Joi.object({
    fo: Joi
        .number()
        .min(80)
        .max(270)
        .required(),
    fhi: Joi
        .number()
        .min(100)
        .max(600)
        .required(),
    flo: Joi
        .number()
        .min(60)
        .max(240)
        .required(),
    jitter_percent: Joi
        .number()
        .min(0)
        .max(0.5)
        .required(),
    jitter_abs: Joi
        .number()
        .min(0)
        .max(0.1)
        .required(),
    rap: Joi
        .number()
        .min(0)
        .max(0.03)
        .required(),
    ppq: Joi
        .number()
        .min(0)
        .max(0.03)
        .required(),
    ddp: Joi
        .number()
        .min(0)
        .max(0.07)
        .required(),
    shimmer: Joi
        .number()
        .min(0)
        .max(0.13)
        .required(),
    shimmer_dB: Joi
        .number()
        .min(0)
        .max(1.5)
        .required(),
    apq3: Joi
        .number()
        .min(0)
        .max(0.07)
        .required(),
    apq5: Joi
        .number()
        .min(0)
        .max(0.09)
        .required(),
    apq: Joi
        .number()
        .min(0)
        .max(0.15)
        .required(),
    dda: Joi
        .number()
        .min(0)
        .max(0.18)
        .required(),
    nhr: Joi
        .number()
        .min(0)
        .max(0.32)
        .required(),
    hnr: Joi
        .number()
        .min(7)
        .max(34)
        .required(),
    dfa: Joi
        .number()
        .min(0.4)
        .max(0.9)
        .required(),
    spread1: Joi
        .number()
        .min(-8)
        .max(-3)
        .required(),
    spread2: Joi
        .number()
        .min(0)
        .max(0.5)
        .required(),
    d2: Joi
        .number()
        .min(1)
        .max(4)
        .required(),
    ppe: Joi
        .number()
        .min(0)
        .max(0.6)
        .required(),
});