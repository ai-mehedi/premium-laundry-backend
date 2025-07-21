import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemtypeService } from './itemtype.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Itemtype')
@Controller('web/itemtype')
export class ItemtypeController {
  constructor(private readonly ItemtypeService: ItemtypeService) { }

  @Get()
  findAll() {
    return this.ItemtypeService.findAll();
  }
}
