import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../comment.repository';

@Injectable()
export class CommentExistsPipe implements PipeTransform {
  constructor(private readonly commentRepository: CommentRepository) {}

  async transform(commentId: string) {
    const comment = await this.commentRepository.findComment({ _id: commentId });
    if (!comment) {
      throw new NotFoundException('Comment does not exist');
    }
    return comment;
  }
}
