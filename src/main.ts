import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppConfigService } from './config/app.config';
import { setupSwagger } from './shared/services/swagger';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/validation/global-exception.filter';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });
  global.ROOT_DIR = join(process.cwd());
  const appConfigService: AppConfigService = app.get(AppConfigService);
  const port = appConfigService.http.port;

  app.use(cookieParser(appConfigService.adminSession.secret));
  app.enableCors();

  // Enable View engine and static assets
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  // Setup swagger
  setupSwagger(app);

  // Exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new GlobalValidationPipe());

  await app.listen(port, () => {
    console.log(`Application running at ${port}`);
  });
}
bootstrap();
