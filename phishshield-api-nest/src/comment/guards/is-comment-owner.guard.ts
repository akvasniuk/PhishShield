import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { CommentRepository } from '../comment.repository';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { Types } from 'mongoose';

@Injectable()
export class IsCommentOwnerGuard implements CanActivate {
  constructor(private readonly commentRepository: CommentRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = request;
    const { commentId } = request.params;

    const comment = await this.commentRepository.findComment({ _id: commentId });

    if (!(comment.userId instanceof Types.ObjectId)) {
      throw new ForbiddenException('Comment userId is not a valid ObjectId');
    }

    if (!comment.userId.equals(new Types.ObjectId(String(user._id)))) {
      throw new ForbiddenException('User is not the owner of this comment');
    }

    return true;
  }
}
