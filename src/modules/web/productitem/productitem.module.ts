import { Module } from '@nestjs/common';
import { ProductitemService } from './productitem.service';
import { ProductitemController } from './productitem.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItems, ProductItemsSchema } from 'src/models/productitems-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductItems.name, schema: ProductItemsSchema }])],
  controllers: [ProductitemController],
  providers: [ProductitemService],
})
export class ProductitemModule { }
