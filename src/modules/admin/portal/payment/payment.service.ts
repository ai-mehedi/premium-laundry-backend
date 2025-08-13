import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentModel } from 'src/models/payment-schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { RandomNumberString } from 'src/common/helpers/utils/string.utils';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly PaymentModel: PaymentModel,
  ) { }

 
  async addUpdatePayment(data: CreatePaymentDto) {
    console.log(data);

    if (data.action_id) {
      const checkService = await this.PaymentModel.findOne({
        _id: data.action_id,
      });
      if (!checkService) {
        throw new BadRequestException({
          message: 'Payment does not exist.',
          field: 'action_id',
        });
      }

      await this.PaymentModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {

            title: data.title,
            invoice: data.invoice,
            thumbnail: data.thumbnail,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            paymentDate: data.paymentDate,
            note: data.note,
            isActive: data.isActive,

          },
        },
      );
    }

    if (!data.action_id) {

      const invoiceid = RandomNumberString(6);

      const checkEmail = await this.PaymentModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Payment already exists.',
          field: 'action_id',
        });
      }
      console.log('Creating new payment with invoice id:', invoiceid);
      await this.PaymentModel.create({
        title: data.title,
        invoice: invoiceid,
        thumbnail: data.thumbnail,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        paymentDate: data.paymentDate,
        note: data.note,
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
    const renderPath = 'views/admin/portal/payments/widgets/list.ejs';
    const searchBy = ['title', 'invoice'];

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

    const results = await this.PaymentModel.paginate({}, options);

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

  async findPaymentById(_id: string) {
    return this.PaymentModel.findById(_id);
  }

  async deletePayment(id: string) {
    const result = await this.PaymentModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Payment not found',
      });
    }
    return {
      message: 'Payment deleted successfully',
    };
  }
}
