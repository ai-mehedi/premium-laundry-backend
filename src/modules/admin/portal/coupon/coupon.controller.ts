import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/coupons')
export class CouponController {

  constructor(private readonly CouponService: CouponService) { }

  @Get('list')
  @Render('admin/portal/coupons/list')
  faqsList() {
    return {
      title: 'coupons',
    };
  }

  @Post('list')
  async couponsListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.CouponService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/coupons/add')
  async addUpdateFaq(@Query('id') id: string) {
    let title = 'Add FAQ';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.CouponService.findCouponById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'FAQ not found',
        });
      }
      title = 'Update FAQ';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
    };
  }

  @Post('add')
  async addUpdateCouponSubmit(@Body() data: CreateCouponDto) {

    await this.CouponService.addUpdateCoupon(data);
    return {
      message: data.action_id ? 'Coupon has been updated' : 'Coupon has been added',
      redirect: '/admin/coupons/list',
    };
  }

  @Delete()
  async deleteFaq(@Query('id') id: string) {
    return await this.CouponService.deleteCoupon(id);
  }
}
