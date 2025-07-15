import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Category, CategoryModel } from 'src/models/category-schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: CategoryModel,
    private readonly i18n: I18nService,
  ) {}
  async findAll() {
    const categories = await this.CategoryModel.find({ isActive: true })
      .select('-__v -isDeleted -deletedAt')
      .lean();
    return {
      message: 'Categories retrieved successfully',
      categories,
    };
  }
}
