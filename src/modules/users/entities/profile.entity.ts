import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';

import { User } from './user.entity';

@Schema()
export class Profile extends Document {
  @Prop()
  code: string;

  @Prop({
    unique: true,
  })
  username: string;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'User' })
  user: User;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
