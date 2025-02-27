import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async insertComment(comment: Partial<Comment>): Promise<Comment> {
    return this.commentModel.create(comment);
  }

  async updateComment(commentId: string, comment: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(commentId, { comment }, { new: true });
  }

  async deleteComment(commentId: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(commentId);
  }

  async findComment(commentParam: object): Promise<Comment | null> {
    return this.commentModel.findOne(commentParam);
  }

  async countComments(): Promise<number> {
    return this.commentModel.countDocuments();
  }

  async getComments(page: number, perPage: number): Promise<Comment[]> {
    return this.commentModel
      .find()
      .limit(perPage)
      .skip(perPage * (page - 1))
      .sort({ createdAt: 'desc' })
      .select('-__v')
      .lean()
      .exec();
  }

  async findCommentAndUpdate(commentId: string, reply: object): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(
        commentId,
        { $push: { replies: reply } },
        { new: true }
      )
      .lean();
  }

  async deleteReplyComment(commentId: string, replyId: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(
      commentId,
      { $pull: { replies: { _id: replyId } } },
      { new: true },
    );
  }

  async updateReplyComment(commentId: string, replyId: string, reply: string): Promise<Comment | null> {
    return this.commentModel.findOneAndUpdate(
      { _id: commentId, 'replies._id': replyId },
      { $set: { 'replies.$.reply': reply } },
    );
  }
}
