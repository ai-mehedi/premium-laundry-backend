import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type MembershipDocument = HydratedDocument<Membership>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class Membership {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  price: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  duration: number;

  @ApiProperty()
  @Prop({ type: String, required: true })
  stripePriceId: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.plugin(paginatePlugin);
MembershipSchema.plugin(softDeletePlugin);

export type MembershipModel = PaginateModel<Membership> &
  SoftDeleteModel<Membership>;
