import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { Category } from './category-schema';

export type BlogDocument = HydratedDocument<Blog>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class Blog {
  @ApiProperty()
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  summary: string;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  categoryId: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: true })
  thumbnail: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.plugin(paginatePlugin);
BlogSchema.plugin(softDeletePlugin);

export type BlogModel = PaginateModel<Blog> & SoftDeleteModel<Blog>;
