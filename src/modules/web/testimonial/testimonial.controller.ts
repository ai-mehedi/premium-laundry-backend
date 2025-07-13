import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Testimonial')
@Controller('web/testimonial')

export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) { }
  @Get()
  findAllTestimonial() {
    return this.testimonialService.findAll();
  }
}
