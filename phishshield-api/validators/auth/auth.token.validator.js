const Joi = require('joi');
const {Regexp} = require('../../constants');

module.exports = Joi.object({
    clientId: Joi.string()
        .regex(Regexp.GOOGLE_CLIENT_ID)
        .required(),
    credential: Joi.string()
        .regex(Regexp.JSONWEBTOKEN)
        .required()
});