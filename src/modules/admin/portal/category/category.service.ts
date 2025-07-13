import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryModel } from 'src/models/category-schema';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: CategoryModel,
  ) { }

  async addUpdateCategory(data: CreateCategoryDto) {
    if (data.action_id) {
      const checkService = await this.CategoryModel.findOne({ _id: data.action_id });
      if (!checkService) {
        throw new BadRequestException({
          message: 'Category does not exist.',
          field: 'action_id',
        });
      }

      await this.CategoryModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            title: data.title,
            thumbnail: data.thumbnail,
            isActive: data.isActive,
            description: data.description,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.CategoryModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Category already exists.',
          field: 'action_id',
        });
      }
      await this.CategoryModel.create({
        title: data.title,
        thumbnail: data.thumbnail,
        isActive: data.isActive,
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
    const renderPath = 'views/admin/portal/categories/widgets/list.ejs';
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

    const results = await this.CategoryModel.paginate({}, options);

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

  async findCategoryById(_id: string) {
    return this.CategoryModel.findById(_id);
  }

  async deleteCategory(id: string) {
    const result = await this.CategoryModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Category not found',
      });
    }
    return {
      message: 'Category deleted successfully',
    };
  }
}
