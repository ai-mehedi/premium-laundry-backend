import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type ContactDocument = HydratedDocument<Contact>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class Contact {
  @ApiProperty()
  @Prop({ type: String, required: true })
  firstname: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  lastname: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  email: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  phone: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  subject: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  message: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.plugin(paginatePlugin);
ContactSchema.plugin(softDeletePlugin);

export type ContactModel = PaginateModel<Contact> & SoftDeleteModel<Contact>;
