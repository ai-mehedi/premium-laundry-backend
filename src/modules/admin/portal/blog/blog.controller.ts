import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Render,
  NotFoundException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('list')
  @Render('admin/portal/blogs/list')
  blogsList() {
    return {
      title: 'Blogs',
    };
  }

  @Post('list')
  async blogsListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.blogService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/blogs/add')
  async addUpdateBlog(@Query('id') id: string) {
    let title = 'Add Blog';
    let is_update = false;
    let action_data = {};
    const categories = await this.blogService.getCategories();
    if (id) {
      const checkAdmin = await this.blogService.findBlogById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Blog not found',
        });
      }
      title = 'Update Blog';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      categories: categories,
      title: title,
      is_update: is_update,
      action_data: action_data,
    };
  }

  @Post('add')
  async addUpdateBlogSubmit(@Body() data: CreateBlogDto) {
    await this.blogService.addUpdateBlog(data);
    return {
      message: data?.action_id
        ? 'Blog has been updated'
        : 'Blog has been added',
      continue: {
        redirect: '/admin/portal/blogs/list',
      },
    };
  }

  @Delete()
  async deleteBlog(@Query('id') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}
