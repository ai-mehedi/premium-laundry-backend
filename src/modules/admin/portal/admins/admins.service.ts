import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AddUpdateAdminDto } from './dto/add-update-admin.dto';
import { hashPassword } from 'src/common/helpers/utils/password.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { Admin, AdminModel } from 'src/models/admin.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
  ) {}

  async findAdminById(_id: string) {
    return this.adminModel.findById(_id);
  }

  async addUpdateAdmin(data: AddUpdateAdminDto) {
    if (data.action_id) {
      const checkAdmin = await this.adminModel.findOne({ _id: data.action_id });
      if (!checkAdmin) {
        throw new BadRequestException({
          message: 'Admin does not exist.',
          field: 'email',
        });
      }

      let password: string = '';
      if (data.password && data.password.trim() !== '') {
        password = await hashPassword(data.password);
      }

      await this.adminModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            name: data.name,
            isActive: data.isActive,
            roles: JSON.parse(data.roles || '[]'),
            ...(password === '' ? {} : { password: password }),
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.adminModel.findOne({ email: data.email });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Email is already exist.',
          field: 'email',
        });
      }
      await this.adminModel.create({
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password || ''),
        isActive: data.isActive,
        roles: JSON.parse(data.roles || '[]'),
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
    const renderPath = 'views/admin/portal/admins/widgets/list.ejs';
    const searchBy = ['firstName'];

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

    const results = await this.adminModel.paginate({}, options);

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
