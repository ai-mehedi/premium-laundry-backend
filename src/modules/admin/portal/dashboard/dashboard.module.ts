import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.schema';
import { Order, OrderSchema } from 'src/models/order.schema';
import { Payment, PaymentSchema } from 'src/models/payment-schema';
import { User, UserSchema } from 'src/models/user.schema';
import { Shoecare ,ShoecareSchema} from 'src/models/shoecare.schema';

@Module({
  imports: [
     MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Shoecare.name,
        schema: ShoecareSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
