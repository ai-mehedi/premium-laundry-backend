import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCouponDto } from './dto/update-dto';

@ApiTags('Coupon')
@Controller('web/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get(':discountCode')
  findOneBlog(@Param('discountCode') discountCode: string) {
    return this.couponService.findBySlug(discountCode);
  }
  @Patch(':discountCode')
  update(
    @Param('discountCode') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.updateBySlug(id, updateCouponDto);
  }
}
