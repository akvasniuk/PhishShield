import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps: true})
export class User extends Document {
  @Prop({
    type: String,
    isRequired: true,
  })
  firstname: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  lastname: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  email: string;

  @Prop({
    type: String,
    isRequired: true,
    select: false
  })
  password: string;

  @Prop({
    type: String,
    isRequired: false,
  })
  avatar?: string;

  @Prop({
    type: String,
    default: 'USER',
  })
  role: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isUserActivated: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  deleted: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isGoogleAuth: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
