import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ItemtypeService } from './itemtype.service';
import { CreateItemtypeDto } from './dto/create-itemtype.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/itemtypes')
export class itemtypeController {
  constructor(private readonly ItemtypeService: ItemtypeService) {}

  @Get('list')
  @Render('admin/portal/itemtypes/list')
  subservicesList() {
    return {
      title: 'Sub Service',
    };
  }

  @Post('list')
  async itemtypeListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.ItemtypeService.getPaginatedList(queryDto);
    
    return result;
  }

  @Get('add')
  @Render('admin/portal/itemtypes/add')
  async addUpdateitemtypes(@Query('id') id: string) {
    let title = 'Add itemtype';
    let is_update = false;
    let action_data = {};
    const services = await this.ItemtypeService.findServicesAll();
    if (!services || services.length === 0) {
      throw new NotFoundException({
        message: 'Service not found',
      });
    }
    if (id) {
      const checkAdmin = await this.ItemtypeService.findItemtypeById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Sub Service not found',
        });
      }

      title = 'Update Sub Service';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
      services: services,
    };
  }

  @Post('add')
  async addUpdatesubserviceSubmit(@Body() data: CreateItemtypeDto) {
    await this.ItemtypeService.addUpdateItemtype(data);
    return {
      message: data.action_id
        ? 'Sub Service has been updated'
        : 'Sub Service has been added',
      redirect: '/admin/itemtypes/list',
    };
  }

  @Delete()
  async deletesubservice(@Query('id') id: string) {
    return await this.ItemtypeService.deleteItemtype(id);
  }
}
