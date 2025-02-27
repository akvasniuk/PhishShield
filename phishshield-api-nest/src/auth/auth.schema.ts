import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

@Schema({ timestamps: true })
export class OAuth extends Document {
  @Prop({
    type: String,
  })
  accessToken: string;

  @Prop({
    type: String,
  })
  refreshToken: string;

  @Prop({
    type: String,
  })
  passwordToken: string;

  @Prop({
    type: String,
  })
  emailToken: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true
  })
  user: User;
}

export const OAuthSchema = SchemaFactory.createForClass(OAuth);

OAuthSchema.pre('findOne', function () {
  this.populate('user');
});