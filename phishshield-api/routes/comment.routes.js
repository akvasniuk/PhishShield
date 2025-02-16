const router = require('express').Router();

const {commentController} = require('../controllers');
const {userMiddleware, authMiddleware, commentMiddleware} = require("../middlewars");

router.get('/', commentController.getComments);

router.get('/:commentId', commentController.createComment);

router.post('/:userId',
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    commentMiddleware.isCommentDataValid,
    commentMiddleware.isUsernameRelatedToUser,
    commentController.createComment);

router.delete('/:userId/:commentId',
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    commentMiddleware.isCommentExists,
    commentMiddleware.isUserHaveComment,
    commentController.deleteComment);

router.put('/:userId/:commentId',
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    commentMiddleware.isCommentExists,
    commentMiddleware.isUserHaveComment,
    commentController.updateComment);

router.post('/:userId/:commentId/reply',
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    commentMiddleware.isCommentExists,
    commentMiddleware.isCommentReplyDataValid,
    commentController.createReplyComment);

router.put("/:userId/:commentId/reply/:replyId",
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    commentMiddleware.isCommentExists,
    commentMiddleware.isCommentReplyDataValid,
    commentMiddleware.isCommentReplyExists,
    commentController.updateReplyComment);

router.delete('/:userId/:commentId/reply/:replyId',
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    commentMiddleware.isCommentExists,
    commentMiddleware.isCommentReplyExists,
    commentController.deleteReplyComment);

module.exports = router;