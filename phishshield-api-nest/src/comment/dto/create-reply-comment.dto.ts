import { IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateReplyCommentDto {
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNotEmpty()
  @IsString()
  @Min(3)
  username: string;

  @IsString()
  @Min(24)
  @Max(24)
  replyCommentId: string;
}