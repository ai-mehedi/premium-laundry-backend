import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { Order, OrderSchema } from 'src/models/order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
   imports: [
      MongooseModule.forFeature([
        {
          name: Order.name,
          schema: OrderSchema,
        },
      ]),
    ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
