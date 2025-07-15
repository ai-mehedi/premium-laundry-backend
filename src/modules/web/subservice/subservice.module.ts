import { Module } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { SubserviceController } from './subservice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subservice, SubserviceSchema } from 'src/models/subservice-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subservice.name, schema: SubserviceSchema },
    ]),
  ],

  controllers: [SubserviceController],
  providers: [SubserviceService],
})
export class SubserviceModule {}
