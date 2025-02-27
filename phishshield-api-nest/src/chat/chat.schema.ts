import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

@Schema({ timestamps: true, collection: "messages" })
export class Chat extends Document {
  @Prop({
    type: {
      text: { type: String, required: true },
    },
    required: true,
  })
  message: { text: string };

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender: User;

  @Prop({
    type: Array,
  })
  users: Array<any>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);