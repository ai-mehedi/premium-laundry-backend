import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeliverypanelDto } from './dto/create-deliverypanel.dto';
import { UpdateDeliverypanelDto } from './dto/update-deliverypanel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from 'src/models/order.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { SEND_SMS_TEMPLATE, SMSService } from 'src/shared/services/sms.service';

@Injectable()
export class DeliverypanelService {
  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: OrderModel,
    private readonly smsService: SMSService,
  ) { }

  async findorderById(_id: string) {
    return this.OrderModel.findById(_id).populate('user').populate('supplier').exec();
  }

  async addUpdateDeliverypanel(data: CreateDeliverypanelDto) {
    if (data.action_id) {

      const checkDeliverypanel = await this.OrderModel.findOne({ _id: data.action_id });

      if (checkDeliverypanel.otpcode !== data.otpcode) {
        throw new BadRequestException({
          message: 'Invalid OTP code.',
          field: 'otpcode',
        });
      }

      if (!checkDeliverypanel) {
        throw new BadRequestException({
          message: 'Order does not exist.',
          field: 'action_id',
        });
      }

      await this.OrderModel.updateOne(
        { _id: data.action_id }, // filter

        { // update operators together
          $push: {
            statuses: {
              status: data.orderstatus,
              updatedBy: data.name,
              note: data.orderstatus,
            },
          },
          $set: {
            orderstatus: data.orderstatus,
          },
        }
      );

      const result = await this.smsService.sendSMS({
        template: SEND_SMS_TEMPLATE.ORDER_DELIVERY_SUCCESS,
        phone: data.phone.replace('+', ''),
        payload: {
          ORDERID: data.orderId,
        },
      });
    }

    if (!data.action_id) {
      throw new BadRequestException({
        message: 'Order already exists.',
        field: 'action_id',
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
    const renderPath = 'views/admin/portal/deliverypanel/widgets/list.ejs';
    const searchBy = ['orderId', 'shippingTime', 'user.fullAddress', 'orderstatus'];

    limit = limit || 25;
    pagination.per_page = limit;
    const offset = (page - 1) * limit;

    options.sortOrder = {
      direction: sortOrder,
      id: sortBy,
    };
    options.customFilters = [
      {
        $match: {
          "statuses.status": "Vendor Dispatched Items",
          "orderstatus": "Order Confirmed"
        }
      },
    ]

    options.extraStages = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      }

    ];

    if (searchText) {
      options.search = {
        searchText,
        searchBy,
      };
    }

    const results = await this.OrderModel.paginate({}, options);
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


  async getPaginatedorderComplete({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/deliverypanel/widgets/list.ejs';
    const searchBy = ['orderId', 'shippingTime', 'user.fullAddress', 'orderstatus'];

    limit = limit || 25;
    pagination.per_page = limit;
    const offset = (page - 1) * limit;

    options.sortOrder = {
      direction: sortOrder,
      id: sortBy,
    };
    options.customFilters = [
      {
        $match: {
          "orderstatus": "Delivered"
        }
      },
    ]

    options.extraStages = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'Admin',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplier'
        }
      }

    ];

    if (searchText) {
      options.search = {
        searchText,
        searchBy,
      };
    }

    const results = await this.OrderModel.paginate({}, options);

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

}
