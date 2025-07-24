import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import {
  Product,
  ProductModel,
} from 'src/models/product-schema';

@Injectable()
export class Productervice {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: ProductModel,
    private readonly i18n: I18nService,
  ) { }
  async findAll() {
    return await this.ProductModel.find({
      isActive: true,
    })
      .populate('serviceId')
      .populate('itemtypeID')
      .select('-__v -isDeleted -deletedAt')
      .lean();
  }
}
