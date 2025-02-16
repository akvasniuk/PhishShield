const Joi = require('joi');

module.exports = Joi.object({
    reply: Joi
        .string()
        .required(),
    username: Joi
        .string()
        .required()
        .min(3),
    replyCommentId: Joi.string()
        .min(24)
        .max(24)
});
