import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModel } from 'src/models/blog.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { Category, CategoryModel } from 'src/models/category-schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: BlogModel,
    @InjectModel(Category.name)
    private readonly categoryModel: CategoryModel,
  ) {}

  async findBlogById(_id: string) {
    return this.blogModel.findById(_id);
  }

  async getCategories() {
    return this.categoryModel.find({ isActive: true });
  }

  async addUpdateBlog(data: CreateBlogDto) {
    if (data.action_id) {
      const checkBlog = await this.blogModel.findOne({ _id: data.action_id });
      if (!checkBlog) {
        throw new BadRequestException({
          message: 'Blog does not exist.',
          field: 'action_id',
        });
      }

      await this.blogModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: data,
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.blogModel.findOne({ _id: data.action_id });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Blog already exists.',
          field: 'action_id',
        });
      }
      await this.blogModel.create(data);
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
    const renderPath = 'views/admin/portal/blogs/widgets/list.ejs';
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

    const results = await this.blogModel.paginate({}, options);

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

  async deleteBlog(id: string) {
    const result = await this.blogModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Blog not found',
      });
    }
    return {
      message: 'Blog deleted successfully',
    };
  }
}
