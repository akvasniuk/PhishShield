const { ErrorHandler, errorMessage } = require('../error');
const { statusCode } = require('../constants');
const { userService } = require('../services');
const { userValidator, urlValidator, phishingDetectionValidator} = require('../validators');
const { userHelper } = require('../helpers');

module.exports = {
    isTypeExists: async (req, res, next) => {
        try {
            const { type } = req.query;

            const { error } = await phishingDetectionValidator.typeValidator.validate(type);

            if (error) {
                throw new ErrorHandler(
                    statusCode.BAD_REQUEST,
                    error.details[0].message,
                    errorMessage.TYPE_NOT_VALID.code
                );
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isPhishingDataValid: async (req, res, next) => {
        try {
            if(req["type"] === "text"){
                const { error } = await phishingDetectionValidator.textValidator.validate(req.body);

                if (error) {
                    throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.NOT_VALID_DATA.code);
                }
            }

            if(req["type"] === "url"){
                const { error } = await phishingDetectionValidator.urlValidator.validate(req.body);

                if (error) {
                    throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.NOT_VALID_DATA.code);
                }
            }

            next();
        } catch (e) {
            next(e);
        }
    },
};
