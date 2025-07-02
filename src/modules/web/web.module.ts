import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';
import { FaqModule } from './faq/faq.module';
import { FaceModule } from './face/face.module';
import { SpaceModule } from './space/space.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    AuthModule,
    NewsletterModule,
    ContactModule,
    UserModule,
    FaqModule,
    FaceModule,
    SpaceModule,
    BlogModule,
  ],
})
export class WebModule {}
