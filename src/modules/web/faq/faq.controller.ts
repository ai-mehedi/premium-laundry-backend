import { Controller, Get } from '@nestjs/common';
import { FaqService } from './faq.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FAQs')
@Controller('web/faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) { }
  @Get()
  findAllFAQs() {
    return this.faqService.findAll();
  }
}
