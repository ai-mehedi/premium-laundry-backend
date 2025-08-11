import { Module } from '@nestjs/common';
import { DeliverypanelService } from './deliverypanel.service';
import { DeliverypanelController } from './deliverypanel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/models/order.schema';
import { SMSService } from 'src/shared/services/sms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [DeliverypanelController],
  providers: [DeliverypanelService, SMSService],
})
export class DeliverypanelModule { }
