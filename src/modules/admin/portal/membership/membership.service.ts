import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Membership, MembershipModel } from 'src/models/membership-schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name)
    private readonly membershipModel: MembershipModel,
  ) {}

  async findMembershipById(_id: string) {
    return this.membershipModel.findById(_id);
  }

  async addUpdateMemberShipSubmit(data: CreateMembershipDto) {
    if (data.action_id) {
      const checkAdmin = await this.membershipModel.findOne({
        _id: data.action_id,
      });
      if (!checkAdmin) {
        throw new BadRequestException({
          message: 'Membership does not exist.',
          field: 'action_id',
        });
      }
      await this.membershipModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: data,
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.membershipModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Membership already exists.',
          field: 'action_id',
        });
      }
      await this.membershipModel.create({
        name: data.name,
        price: data.price,
        duration: data.duration,
        isActive: data.isActive || true,
      });
    }
  }

  async membershipListPaginated({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/memberships/widgets/list.ejs';
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

    const results = await this.membershipModel.paginate({}, options);

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
