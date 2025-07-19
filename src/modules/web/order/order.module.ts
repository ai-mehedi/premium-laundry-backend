import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/models/product-schema';
import { User, UserSchema } from 'src/models/user.schema';
import { Order ,OrderSchema} from 'src/models/order.schema';
import { Coupon, CouponSchema } from 'src/models/coupon-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: OrderSchema }])

  ],

  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
