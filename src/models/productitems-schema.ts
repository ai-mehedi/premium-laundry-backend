import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { Service } from './Service-schema';
import { Subservice } from './subservice-schema';

export type ProductItemsDocument = HydratedDocument<ProductItems>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class ProductItems {
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
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Subservice.name,
    required: true,
  })
  subserviceId: string;
  @ApiProperty()
  @Prop({
    type: {
      washAndIron: { type: Number, default: 0 },
      drycleaning: { type: Number, default: 0 },
      iron: { type: Number, default: 0 },
    },
    required: true,
  })
  price: {
    washAndIron: number;
    drycleaning: number;
    iron: number;
  };

  @ApiProperty()
  @Prop({
    type: {
      washAndIron: { type: Number, default: 0 },
      drycleaning: { type: Number, default: 0 },
      iron: { type: Number, default: 0 },
    },
    required: true,
  })
  vendorPrice: {
    washAndIron: number;
    drycleaning: number;
    iron: number;
  };

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProductItemsSchema = SchemaFactory.createForClass(ProductItems);

ProductItemsSchema.plugin(paginatePlugin);
ProductItemsSchema.plugin(softDeletePlugin);

export type ProductItemsModel = PaginateModel<ProductItems> &
  SoftDeleteModel<ProductItems>;
