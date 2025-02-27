import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentReplyExistsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { replyId } = request.params;
    const comment = request.comment;

    const isReplyExists = comment.replies.some(reply => reply._id.toString() === replyId);
    if (!isReplyExists) {
      throw new NotFoundException('Reply does not exist');
    }

    return true;
  }
}