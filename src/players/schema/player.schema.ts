import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({
  timestamps: true,
})
export class Player {
  @Prop()
  name: string;
  @Prop({ unique: true })
  email: string;
  @Prop()
  phone: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
