import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { User } from './user.schema';

export type OrderDocument = HydratedDocument<Order>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({ timestamps: true, _id: true })
export class OrderProductService {
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  productId: string;
}

@Schema({ timestamps: true, _id: true })
export class OrderProduct {
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  productId: string;

  @ApiProperty()
  @Prop({ type: [OrderProductService], required: true })
  services: OrderProductService[];
}

@Schema({ timestamps: true, _id: true })
export class OrderStatus {
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  status: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  updatedBy: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  note: string;
}

@Schema({
  timestamps: true,
})
export class Order {
  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: [OrderProduct], required: true })
  products: OrderProduct[];

  @ApiProperty()
  @Prop({ type: [OrderStatus], required: true })
  statuses: OrderStatus[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.plugin(paginatePlugin);
OrderSchema.plugin(softDeletePlugin);

export type OrderModel = PaginateModel<Order> & SoftDeleteModel<Order>;
