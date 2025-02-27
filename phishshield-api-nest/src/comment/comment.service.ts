import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { UsersRepository } from '../users/user.repository';
import { UserHelper } from '../users/helpers/user.helper';
import { Types } from 'mongoose';
import { CreateReplyCommentDto } from './dto/create-reply-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly usersRepository: UsersRepository,
    private readonly userHelper: UserHelper
  ) {}

  async createComment(commentData: any) {
    return this.commentRepository.insertComment(commentData);
  }

  async getComments(page: number, perPage: number) {
    const commentsCount = await this.commentRepository.countComments();
    let comments = await this.commentRepository.getComments(page, perPage);

    comments = await Promise.all(
      comments.map(async (comment) => {
        const user = this.userHelper.userNormalization(comment.userId, [
          'deleted', 'deletedAt', 'createdAt', 'updatedAt', '__v', 'isUserActivated', 'email',
        ]);

        const repliesArr = await Promise.all(
          comment.replies.map(async (reply) => {
            const userObj = await this.usersRepository.findUser({ _id: reply.userId });
            const normalizeUser = this.userHelper.userNormalization(userObj, [
              'deleted', 'deletedAt', 'createdAt', 'updatedAt', '__v', 'isUserActivated', 'email',
            ]);
            return { ...reply, user: normalizeUser };
          })
        );

        repliesArr.forEach(reply => {
          if (reply.replyCommentId) {
            reply.answerToUser = repliesArr.find(r =>
              new Types.ObjectId(r.userId).equals(new Types.ObjectId(reply.replyCommentId))
            )?.username;
          }
        });

        delete comment.userId;
        return { ...comment, user, replies: repliesArr };
      })
    );

    return {
      comments,
      page,
      pages: comments.length ? Math.ceil(commentsCount / perPage) : 1,
    };
  }

  async deleteComment(commentId: string) {
    return this.commentRepository.deleteComment(commentId);
  }

  async updateComment(commentId: string, comment: string) {
    return this.commentRepository.updateComment(commentId, comment);
  }

  async createReplyComment(
    commentId: string,
    userId: string,
    dto: CreateReplyCommentDto
  ) {
    const replyObj = {
      commentId,
      userId,
      username: dto.username,
      reply: dto.reply,
      replyCommentId: dto.replyCommentId || null,
    };

    const updatedComment = await this.commentRepository.findCommentAndUpdate(commentId, replyObj);

    const replies = await Promise.all(
      updatedComment.replies.map(async (reply) => {
        if (reply.replyCommentId) {
          const userToReply = await this.usersRepository.findUser({ _id: reply.replyCommentId });
          return { ...reply, answerToUser: `${userToReply.firstname} ${userToReply.lastname}` };
        }
        return reply;
      })
    );

    return { ...updatedComment, replies };
  }

  async updateReplyComment(commentId: string, replyId: string, replyText: string) {
    const updatedComment = await this.commentRepository.updateReplyComment(commentId, replyId, replyText);
    if (!updatedComment) {
      throw new NotFoundException('Reply not found or could not be updated');
    }
    return updatedComment;
  }

  async deleteReplyComment(commentId: string, replyId: string): Promise<boolean> {
    const result = await this.commentRepository.deleteReplyComment(commentId, replyId);
    return !!result;
  }
}
