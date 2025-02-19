const { commentRepository, userRepository } = require('../repositories');
const { userHelper } = require('../helpers');

module.exports = {
  createComment: (commentData) => commentRepository.insertComment(commentData),

  deleteComment: (commentId) => commentRepository.deleteComment(commentId),

  updateComment: (commentId, comment) => commentRepository.updateComment(commentId, comment),

  getComments: async (page, perPage) => {
    const commentsCount = await commentRepository.countComments();
    let comments = await commentRepository.getComments(page, perPage);

    comments = await Promise.all(comments.map(async (comment) => {
      const user = userHelper.userNormalizator(comment.userId.toJSON(), [
        'deleted', 'deletedAt', 'createdAt', 'updatedAt', '__v', 'isUserActivated', 'email',
      ]);

      const repliesArr = await Promise.all(comment.replies.map(async (reply) => {
        const userObj = await userRepository.findUser({ _id: reply.userId });
        const normalizeUser = userHelper.userNormalizator(userObj?.toJSON(), [
          'deleted', 'deletedAt', 'createdAt', 'updatedAt', '__v', 'isUserActivated', 'email',
        ]);
        return { ...reply?.toJSON(), user: normalizeUser };
      }));

      repliesArr.forEach(reply => {
        if (reply.replyCommentId) {
          reply.answerToUser = repliesArr.find(r => r.userId.equals(reply.replyCommentId))?.username;
        }
      });

      comment = comment.toJSON();
      delete comment.userId;
      comment.user = user;
      comment.replies = repliesArr;

      return comment;
    }));

    return {
      comments,
      page,
      pages: comments.length ? Math.ceil(commentsCount / perPage) : 1,
    };
  },

  createReplyComment: async (commentId, userId, reply, username, replyCommentId) => {
    const replyObj = { commentId, username, reply, userId, replyCommentId };
    const createdReplyComment = await commentRepository.findCommentAndUpdate(commentId, replyObj);

    const replies = await Promise.all(createdReplyComment.replies.map(async reply => {
      if (reply.replyCommentId) {
        const userToReply = await userService.findUser({ _id: replyCommentId });
        reply = { ...reply.toJSON(), answerToUser: `${userToReply.firstname} ${userToReply.lastname}` };
      }

      return reply;
    }));

    return { ...createdReplyComment.toJSON(), replies };

  },
  deleteReplyComment: (commentId, replyId) => commentRepository.deleteReplyComment(commentId, replyId),
  updateReplyComment: (commentId, replyId, reply) => commentRepository.updateReplyComment(commentId, replyId, reply),
};


