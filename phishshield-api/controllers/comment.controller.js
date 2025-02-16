const {userService, viewService, commentService} = require("../services");
const {statusCode, successfulMessage} = require("../constants");
const {userHelper} = require("../helpers");


module.exports = {
    createComment: async (req, res, next) => {
        try {
            const id = req.params.userId;
            const {comment, username} = req.body;
            const createdComment = await commentService.insertComment({
                userId: id,
                comment,
                username
            });

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
            console.log(comment)

            await commentService.updateComment(commentId, comment);

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    getComments: async (req, res, next) => {
        try {
            const {page = 1, perPage = 10} = req.query;

            const commentsCount = await commentService.countComments();
            let comments = await commentService.getComments(+page, +perPage);

            comments = await Promise.all(comments?.map(async comment => {
                const user = userHelper.userNormalizator(comment?.userId?.toJSON(), [
                    "deleted",
                    "deletedAt",
                    "createdAt",
                    "updatedAt",
                    "__v",
                    "isUserActivated",
                    "email"
                ]);
                const repliesArr = [];

                if (comment.replies.length > 0) {
                    for (const reply of comment.replies) {
                        const userObj = await userService.findUser({_id: reply.userId});
                        const normalizeUser = userHelper.userNormalizator(userObj?.toJSON(), [
                            "deleted",
                            "deletedAt",
                            "createdAt",
                            "updatedAt",
                            "__v",
                            "isUserActivated",
                            "email"
                        ]);
                        repliesArr.push({...reply?.toJSON(), user: normalizeUser});
                    }

                    repliesArr.forEach(reply => {
                        if (reply.replyCommentId) {
                            reply.answerToUser = repliesArr.find(r => r.userId.equals(reply.replyCommentId))?.username
                        }
                    })
                }

                comment = comment.toJSON();
                delete comment.userId;
                comment.user = user;
                comment.replies = repliesArr;

                return comment
            }))

            res.status(statusCode.UPDATED).json({
                comments,
                page: +page,
                pages: comments.length ? Math.ceil(commentsCount / perPage) : 1
            });
        } catch (e) {
            next(e);
        }
    },

    createReplyComment: async (req, res, next) => {
        try {
            const {commentId, userId} = req.params;
            const {reply, username, replyCommentId} = req.body;
            const replyObj = {
                commentId,
                username,
                reply,
                userId,
                replyCommentId
            }
            let createdReplyComment = await commentService.findCommentAndUpdate(commentId, replyObj);

            const replies = await Promise.all(createdReplyComment.replies.map(async reply => {
                if(reply.replyCommentId){
                    const userToReply = await userService.findUser({_id: replyCommentId});
                    reply = {...reply.toJSON(), answerToUser: `${userToReply.firstname} ${userToReply.lastname}`}
                }

                return reply
            }))

            createdReplyComment = {...createdReplyComment.toJSON(), replies}

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