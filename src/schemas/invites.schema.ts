import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type InviteDocument = Invite & Document;

@Schema({ timestamps: true })
export class Invite extends Document {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: String, required: true, ref: User.name })
  adminId: string

  @Prop({ type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) })
  expireDate: Date;

  @Prop({ default: false })
  used: boolean;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);