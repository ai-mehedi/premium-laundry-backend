import { Module } from '@nestjs/common';
import { MeModule } from './me/me.module';

@Module({
  imports: [MeModule],
})
export class UserModule {}
