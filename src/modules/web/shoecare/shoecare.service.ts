import { Injectable } from '@nestjs/common';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shoecare, ShoecareModel } from 'src/models/shoecare.schema';
import { I18nService } from 'nestjs-i18n';
import { RandomNumberString } from 'src/common/helpers/utils/string.utils';

@Injectable()
export class ShoecareService {
  constructor(
    @InjectModel(Shoecare.name) private shoecareModel: ShoecareModel,
    private readonly i18n: I18nService,
  ) { }
  async create(createShoecareDto: CreateShoecareDto) {
    const orderidgenrate = RandomNumberString(8);

    const createdShoecare = new this.shoecareModel({ ...createShoecareDto, orderid: orderidgenrate });

    await createdShoecare.save();
    return {
      message: this.i18n.t('response-messages.shoecare.created'),
    };
  }

}
