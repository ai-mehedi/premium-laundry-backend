import { Module } from '@nestjs/common';
import { ShoecareService } from './shoecare.service';
import { ShoecareController } from './shoecare.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shoecare, ShoecareSchema } from 'src/models/shoecare.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shoecare.name, schema: ShoecareSchema },
    ]),
  ],

  controllers: [ShoecareController],
  providers: [ShoecareService],
})
export class ShoecareModule { }
