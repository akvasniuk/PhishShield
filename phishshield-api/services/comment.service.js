const {Comment} = require('../database');

module.exports = {
    insertComment: (comment) => Comment.create(comment),
    updateComment: (commentId, comment) => Comment.findByIdAndUpdate(commentId, {comment}),
    deleteComment: (commentId) => Comment.findByIdAndDelete(commentId),
    findComment: (commentParam) => Comment.findOne(commentParam),
    countComments: () => Comment.countDocuments(),
    getComments: (page, perPage) =>
        Comment.find()
            .limit(perPage)
            .skip(perPage * (page - 1))
            .sort({createdAt: 'desc'})
            .select('-__v'),
    findCommentAndUpdate: (commentId, reply) => Comment.findByIdAndUpdate(commentId,
        {$push: {replies: reply}}, {new: true}),
    deleteReplyComment: (commentId, replyId) => Comment.findByIdAndUpdate(commentId,
        {$pull: {replies: {_id: replyId}}}, {new: true}),
    updateReplyComment: (commentId, replyId, reply) => Comment.updateOne(
        {_id: commentId, 'replies._id': replyId},
        {$set: {'replies.$.reply': reply}}
    )
};


