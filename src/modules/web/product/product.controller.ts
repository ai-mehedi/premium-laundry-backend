import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Productervice } from './product.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product ')
@Controller('web/product')
export class ProductController {
  constructor(private readonly Productervice: Productervice) {}

  @Get()
  findAll() {
    return this.Productervice.findAll();
  }
}
