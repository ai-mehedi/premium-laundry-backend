import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubserviceDto } from './dto/create-subservice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subservice, SubserviceModel } from 'src/models/subservice-schema';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { Service, ServiceModel } from 'src/models/Service-schema';
@Injectable()
export class SubserviceService {
  constructor(
    @InjectModel(Subservice.name)
    private readonly SubserviceModel: SubserviceModel,
    @InjectModel(Service.name)
    private readonly ServiceModel: ServiceModel,
  ) { }

  async findsubserviceById(_id: string) {
    return this.SubserviceModel.findById(_id);
  }

  async findServicesAll() {
    return this.ServiceModel.find({ isActive: true })
  }


  async addUpdatesubservice(data: CreateSubserviceDto) {
    if (data.action_id) {
      const checksubservice = await this.SubserviceModel.findOne({
        _id: data.action_id,
      });
      if (!checksubservice) {
        throw new BadRequestException({
          message: 'subservice does not exist.',
          field: 'action_id',
        });
      }

      await this.SubserviceModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            thumbnail: data.thumbnail,
            isActive: data.isActive,
            serviceId: data.serviceId,
            title: data.title,
            description: data.description,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.SubserviceModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'subservice already exists.',
          field: 'action_id',
        });
      }
      await this.SubserviceModel.create({
        thumbnail: data.thumbnail,
        isActive: data.isActive,
        serviceId: data.serviceId,
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
    const renderPath = 'views/admin/portal/subservices/widgets/list.ejs';
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

    options.extraStages = [
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'serviceData',
        },
      },
      {
        $unwind: {
          path: '$serviceData',
          preserveNullAndEmptyArrays: true,
        }
      }
    ]

    const results = await this.SubserviceModel.paginate({}, options);

    const paginate_ui = pagination.getAllPageLinks(
      Math.ceil(results.total / limit),
      Math.abs(results.page),
    );

    let html_data = '';
    let serial_number = offset;

    for (const result of results.records) {
      console.log(result);
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

  async deletesubservice(id: string) {
    const result = await this.SubserviceModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'subservice not found',
      });
    }
    return {
      message: 'subservice deleted successfully',
    };
  }
}
