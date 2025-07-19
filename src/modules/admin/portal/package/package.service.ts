import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { InjectModel } from '@nestjs/mongoose';
import { Package, PackageModel } from 'src/models/package-schema';
@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name)
    private readonly PackageModel: PackageModel,
  ) { }

  async addUpdatePackage(data: CreatePackageDto) {
    if (data.action_id) {
      const checkService = await this.PackageModel.findOne({
        _id: data.action_id,
      });
      if (!checkService) {
        throw new BadRequestException({
          message: 'Package does not exist.',
          field: 'action_id',
        });
      }

      await this.PackageModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            title: data.title,
            thumbnail: data.thumbnail,
            price: data.price,
            isActive: data.isActive,
            description: data.description,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.PackageModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Package already exists.',
          field: 'action_id',
        });
      }
      await this.PackageModel.create({
        title: data.title,
        thumbnail: data.thumbnail,
        isActive: data.isActive,
        price: data.price,
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
    const renderPath = 'views/admin/portal/packages/widgets/list.ejs';
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

    const results = await this.PackageModel.paginate({}, options);

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

  async findPackageById(_id: string) {
    return this.PackageModel.findById(_id);
  }

  async deletePackage(id: string) {
    const result = await this.PackageModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Package not found',
      });
    }
    return {
      message: 'Package deleted successfully',
    };
  }
}
