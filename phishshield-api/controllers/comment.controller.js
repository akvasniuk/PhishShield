const {commentService} = require("../services");
const {statusCode, successfulMessage} = require("../constants");

module.exports = {
    createComment: async (req, res, next) => {
        try {
            const {userId} = req.params;
            const {comment, username} = req.body;
            const createdComment = await commentService.createComment({userId, comment, username});

            res.status(statusCode.CREATED).json(createdComment);
        } catch (e) {
            next(e);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const {commentId} = req.params;
            await commentService.deleteComment(commentId);

            res.status(statusCode.UPDATED).json(successfulMessage.DELETED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    updateComment: async (req, res, next) => {
        try {
            const {commentId} = req.params;
            const {comment} = req.body;
            await commentService.updateComment(commentId, comment);

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    getComments: async (req, res, next) => {
        try {
            const {page = 1, perPage = 10} = req.query;
            const commentsData = await commentService.getComments(+page, +perPage);
            res.status(statusCode.UPDATED).json(commentsData);
        } catch (e) {
            next(e);
        }
    },

    createReplyComment: async (req, res, next) => {
        try {
            const {commentId, userId} = req.params;
            const {reply, username, replyCommentId} = req.body;
            const createdReplyComment = await commentService
              .createReplyComment(commentId, userId, reply, username, replyCommentId);

            res.status(statusCode.UPDATED).json(createdReplyComment);
        } catch (e) {
            next(e);
        }
    },

    deleteReplyComment: async (req, res, next) => {
        try {
            const {commentId, replyId} = req.params;
            await commentService.deleteReplyComment(commentId, replyId);

            res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    updateReplyComment: async (req, res, next) => {
        try {
            const {commentId, replyId} = req.params;
            const {reply} = req.body;

            await commentService.updateReplyComment(commentId, replyId, reply);

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },
}