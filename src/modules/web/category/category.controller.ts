import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('web/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }



  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

}
