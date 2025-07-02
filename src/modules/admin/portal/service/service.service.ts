import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service, ServiceModel } from 'src/models/Service-schema';
import { InjectModel } from '@nestjs/mongoose';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name)
    private readonly ServiceModel: ServiceModel,
  ) { }

  async addUpdateServices(data: CreateServiceDto) {
    if (data.action_id) {
      const checkService = await this.ServiceModel.findOne({ _id: data.action_id });
      if (!checkService) {
        throw new BadRequestException({
          message: 'Service does not exist.',
          field: 'action_id',
        });
      }

      await this.ServiceModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            title: data.title,
            description: data.description,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.ServiceModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Service already exists.',
          field: 'action_id',
        });
      }
      await this.ServiceModel.create({
        title: data.title,
        description: data.description,
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
    const renderPath = 'views/admin/portal/services/widgets/list.ejs';
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

    const results = await this.ServiceModel.paginate({}, options);

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

  async findServiceById(_id: string) {
    return this.ServiceModel.findById(_id);
  }

  async deleteService(id: string) {
    const result = await this.ServiceModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Service not found',
      });
    }
    return {
      message: 'Service deleted successfully',
    };
  }
}
