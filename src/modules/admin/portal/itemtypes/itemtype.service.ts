import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemtypeDto } from './dto/create-itemtype.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Itemtype, ItemtypeModel } from 'src/models/itemtype-schema';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { Service, ServiceModel } from 'src/models/Service-schema';
@Injectable()
export class ItemtypeService {
  constructor(
    @InjectModel(Itemtype.name)
    private readonly ItemtypeModel: ItemtypeModel,
    @InjectModel(Service.name)
    private readonly ServiceModel: ServiceModel,
  ) {}

  async findItemtypeById(_id: string) {
    return this.ItemtypeModel.findById(_id);
  }

  async findServicesAll() {
    return this.ServiceModel.find({ isActive: true });
  }

  async addUpdateItemtype(data: CreateItemtypeDto) {
    if (data.action_id) {
      const checkItemtype = await this.ItemtypeModel.findOne({
        _id: data.action_id,
      });
      if (!checkItemtype) {
        throw new BadRequestException({
          message: 'Itemtype does not exist.',
          field: 'action_id',
        });
      }

      await this.ItemtypeModel.updateOne(
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
      const checkEmail = await this.ItemtypeModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Itemtype already exists.',
          field: 'action_id',
        });
      }
      await this.ItemtypeModel.create({
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
    const renderPath = 'views/admin/portal/itemtypes/widgets/list.ejs';
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
        },
      },
    ];

    const results = await this.ItemtypeModel.paginate({}, options);

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

  async deleteItemtype(id: string) {
    const result = await this.ItemtypeModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Itemtype not found',
      });
    }
    return {
      message: 'Itemtype deleted successfully',
    };
  }
}
