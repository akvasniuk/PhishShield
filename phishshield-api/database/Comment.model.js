const {Schema, model} = require('mongoose');

const {dataBaseTablesEnum} = require('../constants/index');

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: dataBaseTablesEnum.USER,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },

    replies: [{
        username: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: dataBaseTablesEnum.USER,
        },
        commentId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        replyCommentId: {
            type: Schema.Types.ObjectId,
        },
        reply: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: new Date().getTime()
        }
    }]

}, {timestamps: true});

commentSchema.pre('find', function () {
    this.populate('userId');
});

module.exports = model(dataBaseTablesEnum.COMMENT, commentSchema);