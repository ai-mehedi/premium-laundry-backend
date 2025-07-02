import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PortalModule } from './portal/portal.module';

@Module({
  imports: [AuthModule, PortalModule],
})
export class AdminModule {}
