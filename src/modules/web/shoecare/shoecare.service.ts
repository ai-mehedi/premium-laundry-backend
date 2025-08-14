import { Injectable } from '@nestjs/common';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shoecare, ShoecareModel } from 'src/models/shoecare.schema';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ShoecareService {
  constructor(
    @InjectModel(Shoecare.name) private shoecareModel: ShoecareModel,
    private readonly i18n: I18nService,
  ) { }
  async create(createShoecareDto: CreateShoecareDto) {
console.log('createShoecareDto', createShoecareDto);
    const createdShoecare = new this.shoecareModel(createShoecareDto);

    await createdShoecare.save();
    return {
      message: this.i18n.t('response-messages.shoecare.created'),
    };
  }

}
