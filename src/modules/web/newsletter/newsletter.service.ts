import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { NewsletterModel, Newsletter } from 'src/models/newsletter.schema';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name)
    private readonly NewsletterModel: NewsletterModel,
    private readonly i18n: I18nService,
  ) {}

  async create(createNewsletterDto: CreateNewsletterDto) {
    const isEMailExists = await this.NewsletterModel.findOne({
      email: createNewsletterDto.email,
    });
    if (isEMailExists) {
      throw new BadRequestException({
        message: this.i18n.t('response-messages.field.already_exists', {
          args: {
            field: 'email',
          },
        }),
      });
    }
    const created = new this.NewsletterModel(createNewsletterDto);
    await created.save();
    return {
      message: this.i18n.t('response-messages.newsletter.subscribed'),
    };
  }
}
