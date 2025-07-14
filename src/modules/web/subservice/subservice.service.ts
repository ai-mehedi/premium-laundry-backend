import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Subservice, SubserviceModel } from 'src/models/subservice-schema';

@Injectable()
export class SubserviceService {
    constructor(
      @InjectModel(Subservice.name)
      private readonly SubserviceModel: SubserviceModel,
      private readonly i18n: I18nService,
    ) { }

  findAll() {
    return this.SubserviceModel
      .find({
        isActive: true,
      })
      .populate('serviceId')
      .select('-__v -isDeleted -deletedAt')
      .lean();
  }

  
}
