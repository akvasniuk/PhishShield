const {statusCode, successfulMessage} = require('../constants');
const {authService } = require('../services');

module.exports = {
    login: async (req, res, next) => {
        try {
            const user = await authService.login(req.user);
            res.status(statusCode.UPDATED).json(user);
        } catch (e) {
            next(e);
        }
    },

    loginGoogle: async (req, res, next) => {
        try {
            const user = await authService.loginGoogle(req.userInfo);
            res.status(statusCode.UPDATED).json(user);
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            await authService.logout(req.user.accessToken, req.params.userId);
            res.status(statusCode.DELETED).json(successfulMessage.SUCCESSFUL_LOGOUT);
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const user = await authService.refresh(req.user, req.user.refreshToken);
            res.status(statusCode.UPDATED).json(user);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            await authService.activate(req.user);
            res.status(statusCode.UPDATED).json(successfulMessage.ACCOUNT_SUCCESSFUL_ACTIVATED);
        } catch (e) {
            next(e);
        }
    },

    changePassword: (req, res, next) => {
        try {
            const {tokenObject: {passwordToken}} = req;
            res.status(statusCode.UPDATED).json({changeTokenPassword: passwordToken});
        } catch (e) {
            next(e);
        }
    }
};
