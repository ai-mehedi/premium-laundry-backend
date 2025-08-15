import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { Order, OrderModel } from 'src/models/order.schema';
import { User, UserModel } from 'src/models/user.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    @InjectModel(Order.name)
    private readonly orderModel: OrderModel,
  ) { }


  async findUserById(id: string) {

    const user = await this.userModel.findById(id);
    const orders = await this.orderModel.find({ user: id });

    return { user, orders };
  }


  async getUserPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/users/widgets/list.ejs';
    const searchBy = ['name', 'email'];

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

    const results = await this.userModel.paginate({}, options);

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
