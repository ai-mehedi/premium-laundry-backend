import { Module } from '@nestjs/common';
import { ShoecareService } from './shoecare.service';
import { ShoecareController } from './shoecare.controller';

@Module({
  controllers: [ShoecareController],
  providers: [ShoecareService],
})
export class ShoecareModule {}
