import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule, AppConfigService } from 'src/config/app.config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => {
        return {
          secret: config.jwt.secret,
          global: true,
        };
      },
      inject: [AppConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
