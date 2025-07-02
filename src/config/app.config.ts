import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { EnvironmentVariables } from './env';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  get env() {
    const nodeEnv = this.configService.get('NODE_ENV');

    return {
      nodeEnv,
      isDev: nodeEnv === 'development',
      isStaging: nodeEnv === 'staging',
      isProduction: nodeEnv === 'production',
    };
  }

  get http() {
    return {
      port: this.configService.get('PORT'),
    };
  }

  get throttle() {
    return {
      ttl: this.configService.get('THROTTLE_TTL'),
      limit: this.configService.get('THROTTLE_LIMIT'),
    };
  }

  get database() {
    return {
      url: this.configService.get('MONGODB_URL'),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get('JWT_SECRET_KEY'),
    };
  }

  get smtp() {
    return {
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      username: this.configService.get('SMTP_USERNAME'),
      password: this.configService.get('SMTP_PASSWORD'),
      from_name: this.configService.get('SMTP_FROM_NAME'),
      from_email: this.configService.get('SMTP_FROM_EMAIL'),
    };
  }

  get adminSession() {
    return {
      secret: this.configService.get('ADMIN_SESSION_SECRET'),
      key: this.configService.get('ADMIN_SESSION_KEY'),
    };
  }

  get web() {
    return {
      base_url: this.configService.get('WEB_BASE_URL'),
    };
  }
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validate: (config) => {
        const validatedConfig = plainToClass(EnvironmentVariables, config, {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        });

        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
          whitelist: false,
        });

        if (errors.length > 0) {
          const logger = new Logger();

          errors.forEach((error: ValidationError) => {
            if (error.constraints) {
              logger.error(Object.values(error.constraints)[0]);
            }
          });

          throw new Error('Environment variables validation failed.');
        }

        return validatedConfig;
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
