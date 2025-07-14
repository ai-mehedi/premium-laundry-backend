import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Coupon, CouponModel } from 'src/models/coupon-schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly CouponModel: CouponModel,

  ) { }

  async findCouponById(_id: string) {
    return this.CouponModel.findById(_id);
  }

  async addUpdateCoupon(data: CreateCouponDto) {

    if (data.action_id) {
      const checkCoupon = await this.CouponModel.findOne({ _id: data.action_id });
      if (!checkCoupon) {
        throw new BadRequestException({
          message: 'Coupon does not exist.',
          field: 'action_id',
        });
      }

      await this.CouponModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            title: data.title,
            discountCode: data.discountCode,
            percentage: Number(data.percentage),
            maximumAttendeeCapacity: Number(data.maximumAttendeeCapacity),
            expierationDate: data.expierationDate,
            isActive: data.isActive,

          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.CouponModel.findOne({ _id: data.action_id });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Coupon already exists.',
          field: 'action_id',
        });
      }
      await this.CouponModel.create({
        title: data.title,
        discountCode: data.discountCode,
        percentage: Number(data.percentage),
        maximumAttendeeCapacity: Number(data.maximumAttendeeCapacity),
        expierationDate: data.expierationDate,
        isActive: data.isActive,
      });
    }
  }

  async getPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/coupons/widgets/list.ejs';
    const searchBy = ['title'];

    limit = limit || 25;
    pagination.per_page = limit;
    const offset = (page - 1) * limit;

    options.sortOrder = {
      direction: sortOrder,
      id: sortBy,
    };

    if (searchText) {
      options.search = {
        searchText,
        searchBy,
      };
    }

    const results = await this.CouponModel.paginate({}, options);

    const paginate_ui = pagination.getAllPageLinks(
      Math.ceil(results.total / limit),
      Math.abs(results.page),
    );

    let html_data = '';
    let serial_number = offset;

    for (const result of results.records) {
      serial_number++;
      html_data += await RenderEjsFile(join(global.ROOT_DIR, renderPath), {
        result,
        serial_number,
      });
    }

    return {
      data_exist: results.total > 0,
      data: html_data,
      total_count: results.total,
      pagination: paginate_ui,
    };
  }

  async deleteCoupon(id: string) {
    const result = await this.CouponModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Coupon not found',
      });
    }
    return {
      message: 'Coupon deleted successfully',
    };
  }

}

