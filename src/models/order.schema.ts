import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { User } from './user.schema';
import { Admin } from './admin.schema';

export type OrderDocument = HydratedDocument<Order>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({ timestamps: true, _id: true })
export class OrderProductService {
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  service: string;
  @ApiProperty()
  @Prop({ type: Number, required: true })
  price: number;
  @ApiProperty()
  @Prop({ type: Number, required: true })
  vendorPrice: number;

}

@Schema({ timestamps: true, _id: true })
export class OrderProduct {
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  productId: string;
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  productName: string;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: true })
  quantity: number;
  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: true })
  subtotal: number;
  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: true })
  vendorSubtotal: number;

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

  @ApiProperty()
  @Prop({ type: String, required: true })
  orderId: string;

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
  @Prop({ type: String, required: true })
  shippingTime: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  delivery: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  vendorCosts: number;

  @ApiProperty()
  @Prop({ type: String, required: true })
  pickupdate?: string;

  @ApiProperty()
  @Prop({ type: String, })
  promoCode: string;
  @ApiProperty()
  @Prop({ type: Number, })
  promoOfferPrice: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  subtotal: number;
  @ApiProperty()
  @Prop({ type: Number, required: true })
  total: number;

  @ApiProperty()
  @Prop({ type: [OrderStatus], required: true })
  statuses: OrderStatus[];

  @ApiProperty()
  @Prop({ type: String, required: true })
  orderstatus: string;

  @ApiProperty()
  @Prop({ type: String, })
  note: string;

  @ApiProperty()
  @Prop({ type: String, })
  otpcode: string;

  @ApiProperty()
  @Prop({ type: String, })
  paidamount: string;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Admin.name,

  })
  supplier: mongoose.Types.ObjectId;

}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.plugin(paginatePlugin);
OrderSchema.plugin(softDeletePlugin);

export type OrderModel = PaginateModel<Order> & SoftDeleteModel<Order>;
