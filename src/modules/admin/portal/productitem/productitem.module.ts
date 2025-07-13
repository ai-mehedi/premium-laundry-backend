import { Module } from '@nestjs/common';
import { ProductitemService } from './productitem.service';
import { ProductitemController } from './productitem.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subservice, SubserviceSchema } from 'src/models/subservice-schema';
import { Service, ServiceSchema } from 'src/models/Service-schema';
import { ProductItems, ProductItemsSchema } from 'src/models/productitems-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subservice.name,
        schema: SubserviceSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Service.name,
        schema: ServiceSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ProductItems.name,
        schema: ProductItemsSchema,
      },
    ]),
  ],
  controllers: [ProductitemController],
  providers: [ProductitemService],
})
export class ProductitemModule { }
