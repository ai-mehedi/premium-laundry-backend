import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Blog, BlogModel } from 'src/models/blog.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: BlogModel,
    private readonly i18n: I18nService,
  ) {}

  async findAllBlogs({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const searchBy = ['title'];

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

    options.project = {
      _id: 1,
      title: 1,
      slug: 1,
      summary: 1,
      thumbnail: 1,
      isActive: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const results = await this.blogModel.paginate(
      {
        isActive: true,
      },
      options,
    );

    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'blogs',
        },
      }),
      result: results,
    };
  }

  async findBlogBySlug(slug: string) {
    const blog = await this.blogModel
      .findOne({
        slug,
        isActive: true,
      })
      .select({
        _id: 1,
        title: 1,
        slug: 1,
        summary: 1,
        thumbnail: 1,
        description: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
      });
    if (!blog) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found'),
        field: 'blog',
      });
    }
    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'blog',
        },
      }),
      blog,
    };
  }
}
