import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type NewsletterDocument = HydratedDocument<Newsletter>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class Newsletter {
  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  email: string;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);

NewsletterSchema.plugin(paginatePlugin);
NewsletterSchema.plugin(softDeletePlugin);

export type NewsletterModel = PaginateModel<Newsletter> &
  SoftDeleteModel<Newsletter>;
