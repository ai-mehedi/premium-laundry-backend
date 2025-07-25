import { Module } from '@nestjs/common';
import { Productervice } from './product.service';
import { ProductitemController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Itemtype, ItemtypeSchema } from 'src/models/itemtype-schema';
import { Service, ServiceSchema } from 'src/models/Service-schema';
import {
  Product,
  ProductSchema,
} from 'src/models/product-schema';

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
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductitemController],
  providers: [Productervice],
})
export class ProductitemModule {}
