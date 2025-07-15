import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductitemService } from './productitem.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product Item')
@Controller('web/productitem')
export class ProductitemController {
  constructor(private readonly productitemService: ProductitemService) {}

  @Get()
  findAll() {
    return this.productitemService.findAll();
  }
}
