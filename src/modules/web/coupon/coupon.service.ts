// coupon.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponModel } from 'src/models/coupon-schema';
import { UpdateCouponDto } from './dto/update-dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: CouponModel,
    private readonly i18n: I18nService,
  ) {}

  async findBySlug(discountCode: string) {
    const coupon = await this.couponModel.findOne({ discountCode });
    if (!coupon) {
      throw new NotFoundException(
        `Coupon with slug "${discountCode}" not found`,
      );
    }
    return coupon;
  }

  async updateBySlug(discountCode: string, dto: UpdateCouponDto) {
    const updated = await this.couponModel.findOneAndUpdate(
      { discountCode },
      dto,
      {
        new: true,
      },
    );
    if (!updated) {
      throw new NotFoundException(
        `Coupon with slug "${discountCode}" not found`,
      );
    }
    return updated;
  }
}
