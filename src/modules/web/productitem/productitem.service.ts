import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import {
  ProductItems,
  ProductItemsModel,
} from 'src/models/productitems-schema';

@Injectable()
export class ProductitemService {
  constructor(
    @InjectModel(ProductItems.name)
    private readonly ProductItemsModel: ProductItemsModel,
    private readonly i18n: I18nService,
  ) {}
  async findAll() {
    return await this.ProductItemsModel.find({
      isActive: true,
    })
      .populate('serviceId')
      .populate('subserviceId')
      .select('-__v -isDeleted -deletedAt')
      .lean();
  }
}
