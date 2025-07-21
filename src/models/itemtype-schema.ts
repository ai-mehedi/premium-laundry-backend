import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { Service } from './Service-schema';

export type ItemtypeDocument = HydratedDocument<Itemtype>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class Itemtype {
  @ApiProperty()
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  thumbnail: string;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Service.name,
    required: true,
  })
  serviceId: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ItemtypeSchema = SchemaFactory.createForClass(Itemtype);

ItemtypeSchema.plugin(paginatePlugin);
ItemtypeSchema.plugin(softDeletePlugin);

export type ItemtypeModel = PaginateModel<Itemtype> &
  SoftDeleteModel<Itemtype>;
