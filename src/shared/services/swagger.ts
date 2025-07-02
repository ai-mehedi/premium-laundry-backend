import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoginModule } from 'src/modules/web/auth/login/login.module';
import { SignupModule } from 'src/modules/web/auth/signup/signup.module';
import { BlogModule } from 'src/modules/web/blog/blog.module';
import { ContactModule } from 'src/modules/web/contact/contact.module';
import { FaceModule } from 'src/modules/web/face/face.module';
import { FaqModule } from 'src/modules/web/faq/faq.module';
import { NewsletterModule } from 'src/modules/web/newsletter/newsletter.module';
import { SpaceModule } from 'src/modules/web/space/space.module';
import { MeModule } from 'src/modules/web/user/me/me.module';

export const setupSwagger = (app: INestApplication) => {
  // Setting up swagger for admin web module
  const webConfig = new DocumentBuilder()
    .setTitle('Gayroom8 API Documentation')
    .setDescription('API documentation for Gayroom8 web module')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Web-API')
    .build();
  const webDocument = SwaggerModule.createDocument(app, webConfig, {
    include: [
      LoginModule,
      SignupModule,
      NewsletterModule,
      ContactModule,
      MeModule,
      FaqModule,
      FaceModule,
      SpaceModule,
      BlogModule,
    ],
  });

  SwaggerModule.setup(`/web-docs`, app, webDocument, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        console.log(req.headers);
        if (req.headers['Content-Type'] !== 'application/json') {
          req.headers['Content-type'] = 'application/json';
        }
        return req;
      },
    },
  });
};
