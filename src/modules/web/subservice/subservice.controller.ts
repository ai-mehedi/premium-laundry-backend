import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubserviceService } from './subservice.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('subservice')
@Controller('web/subservice')
export class SubserviceController {
  constructor(private readonly subserviceService: SubserviceService) {}

  @Get()
  findAll() {
    return this.subserviceService.findAll();
  }
}
