import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Package, PackageModel } from 'src/models/package-schema';


@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private readonly PackageModel: PackageModel,
    private readonly i18n: I18nService,
  ) { }

  async findAll() {
    const packages = await this.PackageModel
      .find({
        isActive: true,
      })
      .select('-__v -isDeleted -deletedAt')
      .lean();
    return {
      message: this.i18n.t('response-messages.faqs.message'),
      packages,
    };
  }
}
