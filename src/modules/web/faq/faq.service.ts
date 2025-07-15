import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Faq, FaqModel } from 'src/models/faq-schema';
@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Faq.name)
    private readonly faqModel: FaqModel,
    private readonly i18n: I18nService,
  ) {}

  async findAll() {
    const faqs = await this.faqModel
      .find({
        isActive: true,
      })
      .select('-__v -isDeleted -deletedAt')
      .lean();
    return {
      message: this.i18n.t('response-messages.faqs.message'),
      faqs,
    };
  }
}
