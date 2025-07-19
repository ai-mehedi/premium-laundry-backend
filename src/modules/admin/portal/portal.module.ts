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
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { SubserviceModule } from './subservice/subservice.module';
import { CategoryModule } from './category/category.module';
import { ProductitemModule } from './product/product.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { CouponModule } from './coupon/coupon.module';
import { PackageModule } from './package/package.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    DashboardModule,
    ProfileModule,
    AdminsModule,
    NewsletterModule,
    ContactModule,
    FaqModule,
    BlogModule,
    UserModule,
    ServiceModule,
    SubserviceModule,
    CategoryModule,
    ProductitemModule,
    TestimonialModule,
    CouponModule,
    PackageModule,
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
