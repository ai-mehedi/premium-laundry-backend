import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminAuthMiddleware } from 'src/common/middleware/admin-auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.schema';
import { CookieService } from 'src/shared/services/cookie.service';
import { ProfileModule } from './profile/profile.module';
import { AdminsModule } from './admins/admins.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContactModule } from './contact/contact.module';
import { FaqModule } from './faq/faq.module';
import { MembershipModule } from './membership/membership.module';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { SubserviceModule } from './subservice/subservice.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    DashboardModule,
    ProfileModule,
    AdminsModule,
    NewsletterModule,
    ContactModule,
    FaqModule,
    MembershipModule,
    BlogModule,
    UserModule,
    ServiceModule,
    SubserviceModule,
  ],
  providers: [CookieService],
})
export class PortalModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminAuthMiddleware)
      .forRoutes({ path: 'admin/portal/*', method: RequestMethod.ALL });
  }
}
