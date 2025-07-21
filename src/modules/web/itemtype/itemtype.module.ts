import { Module } from '@nestjs/common';
import { ItemtypeService } from './itemtype.service';
import { ItemtypeController } from './itemtype.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Itemtype, ItemtypeSchema } from 'src/models/itemtype-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Itemtype.name, schema: ItemtypeSchema },
    ]),
  ],

  controllers: [ItemtypeController],
  providers: [ItemtypeService],
})
export class ItemtypeModule {}
