import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Order, OrderModel } from 'src/models/order.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VendorService {

  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: OrderModel,
  ) { }


  async findFaqById(_id: string) {
    return this.OrderModel.findById(_id);
  }

  async addUpdateFaq(data: CreateVendorDto) {

    if (data.action_id) {
      const checkFaq = await this.OrderModel.findOne({ _id: data.action_id });
      console.log('checkFaq', checkFaq);
      if (!checkFaq) {

        throw new BadRequestException({
          message: 'Orders does not exist.',
          field: 'action_id',
        });
      }

      await this.OrderModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $push: {
            statuses: {
              status: data.status,
              updatedBy: data.updatedBy,
              note: data.note,
            },
          },
        },
      );
    }


  }


  
  async findAllOrdersById(id: string) {
   return this.OrderModel.findById(id)
      .populate('user');
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
    const renderPath = 'views/admin/portal/vendors/widgets/list.ejs';
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


    const results = await this.OrderModel.paginate({ orderstatus: "Order Confirmed" }, options);


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



  async getPaginatedcomplted({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/vendors/widgets/complete.ejs';
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


    const results = await this.OrderModel.paginate({ "statuses.status": "Vendor Dispatched Items" }, options);


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




  async getPaginatedprocess({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/vendors/widgets/process.ejs';
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


    const results = await this.OrderModel.paginate({ "statuses.status": "Vendor Received Items" }, options);


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
