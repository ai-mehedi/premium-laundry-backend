import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Testimonial, TestimonialModel } from 'src/models/testimonial-schema';

@Injectable()
export class TestimonialService {


  constructor(
    @InjectModel(Testimonial.name)
    private readonly TestimonialModel: TestimonialModel,
    private readonly i18n: I18nService,
  ) { }

  async findAll() {
    const testimonial = await this.TestimonialModel
      .find({
        isActive: true,
      })
      .select('-__v -isDeleted -deletedAt')
      .lean();
    return {
      message: this.i18n.t('response-messages.faqs.message'),
      testimonial,
    };
  }

}