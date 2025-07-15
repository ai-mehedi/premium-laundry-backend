import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';
import { FaqModule } from './faq/faq.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { CouponModule } from './coupon/coupon.module';
import { ProductitemModule } from './productitem/productitem.module';
import { SubserviceModule } from './subservice/subservice.module';

@Module({
  imports: [
    AuthModule,
    NewsletterModule,
    ContactModule,
    UserModule,
    FaqModule,
    BlogModule,
    CategoryModule,
    TestimonialModule,
    CouponModule,
    ProductitemModule,
    SubserviceModule,
  ],
})
export class WebModule {}
