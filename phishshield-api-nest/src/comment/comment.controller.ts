import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UsernameValidationPipe } from './pipes/username-validation.pipe';
import { IsUserExistsGuard } from '../users/guards/is-user-exists.guard';
import { IsCommentOwnerGuard } from './guards/is-comment-owner.guard';
import { CommentExistsPipe } from './pipes/comment-exists.pipe';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReplyCommentDto } from './dto/create-reply-comment.dto';
import { CommentReplyExistsGuard } from './guards/comment-reply-exists.guard';
import { UsernameGuard } from './guards/username.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {
  }

  @Get()
  async getComments(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ) {
    return this.commentService.getComments(+page, +perPage);
  }

  @Post(':userId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard, UsernameGuard)
  async createComment(
    @Param('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment({ userId, ...createCommentDto });
  }

  @Delete(':userId/:commentId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard, IsCommentOwnerGuard)
  async deleteComment(@Param('commentId', CommentExistsPipe) commentId: string) {
    await this.commentService.deleteComment(commentId);
    return { message: 'Comment deleted successfully' };
  }

  @Put(':userId/:commentId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard, IsCommentOwnerGuard)
  async updateComment(
    @Param('commentId', CommentExistsPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentService.updateComment(commentId, updateCommentDto.comment);
    return { message: 'Comment updated successfully' };
  }

  @Post(':userId/:commentId/reply')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard)
  async createReplyComment(
    @Param('userId') userId: string,
    @Param('commentId', CommentExistsPipe) commentId: string,
    @Body() createReplyCommentDto: CreateReplyCommentDto,
  ) {
    const replyComment = await this.commentService.createReplyComment(
      commentId,
      userId,
      createReplyCommentDto,
    );
    return { message: 'Reply added successfully', replyComment };
  }

  @Put(':userId/:commentId/reply/:replyId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard, CommentReplyExistsGuard)
  async updateReplyComment(
    @Param('commentId', CommentExistsPipe) commentId: string,
    @Param('replyId') replyId: string,
    @Body() dto: CreateReplyCommentDto,
  ) {
    const updatedReply = await this.commentService.updateReplyComment(commentId, replyId, dto.reply);
    if (!updatedReply) {
      throw new NotFoundException('Reply not found');
    }
    return 'SUCCESSFUL DELETED';
  }

  @Delete(':userId/:commentId/reply/:replyId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard, CommentReplyExistsGuard)
  async deleteReplyComment(@Param('commentId', CommentExistsPipe) commentId: string,
                           @Param('replyId') replyId: string) {
    const isDeleted = await this.commentService.deleteReplyComment(commentId, replyId);
    if (!isDeleted) {
      throw new NotFoundException('Reply not found or could not be deleted');
    }
    return { message: 'Reply deleted successfully' };
  }
}
