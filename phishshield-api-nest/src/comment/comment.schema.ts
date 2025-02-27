import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, collection: "comments" })
export class Reply {
  @Prop({ required: true })
  username: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  commentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  replyCommentId?: string;

  @Prop({ required: true })
  reply: string;

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  answerToUser?: string;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  userId: User;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  username: string;

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: [Reply], default: [] })
  replies: Reply[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.pre('find', function () {
  this.populate('userId');
});
