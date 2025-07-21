import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Itemtype, ItemtypeModel } from 'src/models/itemtype-schema';

@Injectable()
export class ItemtypeService {
  constructor(
    @InjectModel(Itemtype.name)
    private readonly ItemtypeModel: ItemtypeModel,
    private readonly i18n: I18nService,
  ) {}

  findAll() {
    return this.ItemtypeModel.find({
      isActive: true,
    })
      .populate('serviceId')
      .select('-__v -isDeleted -deletedAt')
      .lean();
  }
}
