import { Module } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { SubserviceController } from './subservice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subservice, SubserviceSchema } from 'src/models/subservice-schema';
import { Service, ServiceSchema } from 'src/models/Service-schema';

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
  ],
  controllers: [SubserviceController],
  providers: [SubserviceService],
})
export class SubserviceModule {}
