import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type PhishingDetectionDocument = HydratedDocument<PhishingDetection>;

@Schema({ timestamps: true, collection: 'phishing_detections' })
export class PhishingDetection {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId | User;

  @Prop([{
    model: { type: String, required: true },
    prediction: { type: Number, required: true },
    probability: { type: Number, required: true }
  }])
  predictions: { model: string; prediction: number; probability: number }[];

  @Prop({ type: String, required: true })
  data: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String })
  file?: string;

  @Prop({ type: String })
  image?: string;
}

export const PhishingDetectionSchema = SchemaFactory.createForClass(PhishingDetection);

PhishingDetectionSchema.pre('find', function () {
  this.populate('userId');
});
