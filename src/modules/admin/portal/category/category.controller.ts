import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get('list')
  @Render('admin/portal/categories/list')
  CategoriesList() {
    return {
      title: 'categories',
    };
  }
  @Post('list')
  async CategoryListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.categoryService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/categories/add')
  async addUpdateCategory(@Query('id') id: string) {
    let title = 'Add Category';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.categoryService.findCategoryById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Category not found',
        });
      }
      title = 'Update Category';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
    };
  }

  @Post('add')
  async addUpdateServiceSubmit(@Body() data: CreateCategoryDto) {
    await this.categoryService.addUpdateCategory(data);
    return {
      message: data.action_id
        ? 'Category has been updated'
        : 'category has been added',
      redirect: '/admin/categories/list',
    };
  }

  @Delete()
  async deleteService(@Query('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
