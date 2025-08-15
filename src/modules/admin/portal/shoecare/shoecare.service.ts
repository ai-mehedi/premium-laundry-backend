import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';
import { Shoecare, ShoecareModel } from 'src/models/shoecare.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { SEND_SMS_TEMPLATE, SMSService } from 'src/shared/services/sms.service';

@Injectable()
export class ShoecareService {
  constructor(
    @InjectModel(Shoecare.name)
    private readonly ShoecareModel: ShoecareModel,
    private readonly smsService: SMSService,
  ) { }


async invoice(id: string) {
  const invoiceData = await this.ShoecareModel.findById(id);
  if (!invoiceData) {
    throw new NotFoundException({
      message: 'Invoice not found',
      field: 'id',
    });
  }
  return invoiceData;
}

  async addUpdateShoecare(data: CreateShoecareDto) {

    const parsedServices =
      typeof data.services === 'string'
        ? JSON.parse(data.services)
        : data.services;

    if (data.status === "confirm") {
      const result = await this.smsService.sendSMS({
        template: SEND_SMS_TEMPLATE.SHOECARE_ORDER_CONFIRMATION,
        phone: data.phone.replace('+', ''),
        payload: {
          NAME: data.name,
          TOTAL_PRICE: data.payableamount,
        },
      });

    }else if(data.status === "delivered") {
      const result = await this.smsService.sendSMS({
        template: SEND_SMS_TEMPLATE.SHOECARE_ORDER_DELIVERY_SUCCESS,
        phone: data.phone.replace('+', ''),
        payload: {
          NAME: data.name,
          TOTAL_PRICE: data.payableamount,
        },
      });
    }

    if (data.action_id) {
      const checkService = await this.ShoecareModel.findOne({
        _id: data.action_id,
      });
      if (!checkService) {
        throw new BadRequestException({
          message: 'Shoecare does not exist.',
          field: 'action_id',
        });
      }

      await this.ShoecareModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            name: data.name,
            phone: data.phone,
            address: data.address,
            pickupdate: data.pickupdate,
            pickuptime: data.pickuptime,
            services: parsedServices,
            payableamount: data.payableamount,
            description: data.description,
            status: data.status,
            isActive: data.isActive,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.ShoecareModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Shoecare already exists.',
          field: 'action_id',
        });
      }
      await this.ShoecareModel.create({
        name: data.name,
        phone: data.phone,
        address: data.address,
        pickupdate: data.pickupdate,
        pickuptime: data.pickuptime,
        services: parsedServices,
        payableamount: data.payableamount,
        description: data.description,
        isActive: data.isActive,
        status: data.status,
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
    const renderPath = 'views/admin/portal/shoecares/widgets/list.ejs';
    const searchBy = ['name'];

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

    const results = await this.ShoecareModel.paginate({}, options);

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

  async findShoecareById(_id: string) {
    return this.ShoecareModel.findById(_id);
  }

  async deleteShoecare(id: string) {
    const result = await this.ShoecareModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Shoecare not found',
      });
    }
    return {
      message: 'Shoecare deleted successfully',
    };
  }
}
