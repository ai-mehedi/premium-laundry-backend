import { Module } from '@nestjs/common';
import { ItemtypeService } from './itemtype.service';
import { itemtypeController } from './itemtype.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Itemtype, ItemtypeSchema } from 'src/models/itemtype-schema';
import { Service, ServiceSchema } from 'src/models/Service-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Itemtype.name,
        schema: ItemtypeSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Service.name,
        schema: ServiceSchema,
      },
    ]),
  ],
  controllers: [itemtypeController],
  providers: [ItemtypeService],
})
export class SubserviceModule { }
