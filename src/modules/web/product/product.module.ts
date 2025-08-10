import { Module } from '@nestjs/common';
import { Productervice } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product,
  ProductSchema,
} from 'src/models/product-schema';
import { Itemtype, ItemtypeSchema, } from 'src/models/itemtype-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
    MongooseModule.forFeature([
      { name: Itemtype.name, schema: ItemtypeSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [Productervice],
})
export class ProductModule { }
