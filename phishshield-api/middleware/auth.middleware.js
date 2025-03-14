const {statusCode, constants: {AUTHORIZATION, REFRESH}, successfulMessage} = require('../constants');
const {OAuth} = require('../database');
const {ErrorHandler, errorMessage} = require('../error');
const {passwordHelper, authHelper, userHelper} = require('../helpers');
const {authValidator} = require('../validators');
const {OAuth2Client} = require('google-auth-library');
const {GOOGLE_CLIENT_ID} = require("../constants/constants");
const { userRepository } = require('../repositories');


const client = new OAuth2Client(GOOGLE_CLIENT_ID);

module.exports = {
    checkIsUserDataValid: async (req, res, next) => {
        try {
            const {error} = await authValidator.authLoginValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.NOT_VALID_DATA);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsTokenDataValid: async (req, res, next) => {
        try {
            const {credential, clientId} = req.body;
            const {error} = await authValidator.authTokenValidator.validate({credential, clientId});

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.NO_TOKEN.message,
                    errorMessage.NO_TOKEN.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsEmailExist: async (req,res, next) => {
        try {
            const  {clientId, credential} = req.body;
            const  userInfo = await client.verifyIdToken({
                idToken: credential,
                audience: clientId
            }).then(response => response.getPayload());

            const userByEmail = await userRepository.findUserByEmail(userInfo.email);

            if(userByEmail){
                const {_id} = userByEmail;

                const tokenPair = authHelper.generateTokenPair();

                await OAuth.updateOne({user: _id}, {...tokenPair});

                const normalizedUser = userHelper.userNormalizator(userByEmail.toJSON());

                return res.status(statusCode.UPDATED).json({...tokenPair, user: normalizedUser});
            }

            req.userInfo = userInfo;
            next();
        }catch (e){
            next(e);
        }
    },

    checkIsUserExist: async (req, res, next) => {
        try {
            const {email} = req.body;
            const user = await userRepository.findUserByEmail(email).select('+password');

            if (!user) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.USER_NOT_EXISTS.message, errorMessage.USER_NOT_EXISTS.code);
            }

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsUserActivated: (req, res, next) => {
        try {
            const {user: {isUserActivated}} = req;

            if (!isUserActivated) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED,
                    errorMessage.USER_NOT_ACTIVATED.message, errorMessage.USER_NOT_ACTIVATED.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsPasswordValid: async (req, res, next) => {
        try {
            const {password} = req.body;

            await passwordHelper.compare(password, req.user.password);

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyToken(token);

            const tokenObject = await OAuth.findOne({accessToken: token});

            if (!tokenObject) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.WRONG_TOKEN.message, errorMessage.WRONG_TOKEN.code);
            }

            req.user = tokenObject.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyToken(token, REFRESH);

            const tokenObject = await OAuth.findOne({refreshToken: token});

            if (!tokenObject) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.WRONG_TOKEN.message, errorMessage.WRONG_TOKEN.code);
            }

            req.user = tokenObject;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkMailToken: async (req, res, next) => {
        try {
            const {emailToken} = req.params;

            if (!emailToken) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyEmailToken(emailToken);

            const tokenObject = await OAuth.findOne({emailToken});

            if (!tokenObject) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.WRONG_TOKEN.message, errorMessage.WRONG_TOKEN.code);
            }

            req.user = tokenObject.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkPasswordToken: (param = 'params') => async (req, res, next) => {
        try {
            let passwordToken;

            if (param === 'params') {
                passwordToken = req[param].passwordToken;
            } else {
                passwordToken = req.get(AUTHORIZATION);
            }

            if (!passwordToken) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyPasswordToken(passwordToken);

            const tokenObject = await OAuth.findOne({passwordToken});

            if (!tokenObject) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.WRONG_TOKEN.message, errorMessage.WRONG_TOKEN.code);
            }

            req.tokenObject = tokenObject;

            next();
        } catch (e) {
            next(e);
        }
    }
};
