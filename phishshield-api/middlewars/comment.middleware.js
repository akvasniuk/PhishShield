const {ErrorHandler, errorMessage} = require('../error');
const {statusCode} = require('../constants');
const {userService, commentService} = require('../services');
const {userValidator, urlValidator, commentValidator} = require('../validators');
const {userHelper} = require('../helpers');

module.exports = {

    isCommentDataValid: async (req, res, next) => {
        try {
            const {error} = await commentValidator.createCommentValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.NOT_VALID_DATA.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isCommentReplyDataValid: async (req, res, next) => {
        try {
            const {error} = await commentValidator.createCommentReplyValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.NOT_VALID_DATA.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUsernameRelatedToUser: async (req, res, next) => {
        try {
            const {username} = req.body;
            const {user} = req;
            const userUsername = `${user.firstname} ${user.lastname}`;

            if (username !== userUsername) {
                throw new ErrorHandler(statusCode.BAD_REQUEST,
                    errorMessage.NOT_VALID_DATA.message,
                    errorMessage.NOT_VALID_DATA.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isCommentExists: async (req, res, next) => {
        try {
            const {commentId} = req.params;
            const comment = await commentService.findComment({_id: commentId});

            if (!comment) {
                throw new ErrorHandler(statusCode.BAD_REQUEST,
                    errorMessage.COMMENT_NOT_EXISTS.message,
                    errorMessage.COMMENT_NOT_EXISTS.code);
            }

            req.comment = comment;
            next();
        } catch (e) {
            next(e);
        }
    },

    isCommentReplyExists: async (req, res, next) => {
        try {
            const {replyId} = req.params;
            const {comment} = req;

            const isReplyCommentExists = comment.replies.some(reply => reply._id.equals(replyId));

            if (!isReplyCommentExists) {
                throw new ErrorHandler(statusCode.BAD_REQUEST,
                    errorMessage.COMMENT_NOT_EXISTS.message,
                    errorMessage.COMMENT_NOT_EXISTS.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserHaveComment: async (req, res, next) => {
        try {
            const {commentId} = req.params;
            const {user} = req;
            const comment = await commentService.findComment({_id: commentId});

            if (!comment.userId.equals(user._id)) {
                throw new ErrorHandler(statusCode.BAD_REQUEST,
                    errorMessage.USER_NOT_HAVE_COMMENT.message,
                    errorMessage.USER_NOT_HAVE_COMMENT.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
};
