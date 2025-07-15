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
import { SubserviceService } from './subservice.service';
import { CreateSubserviceDto } from './dto/create-subservice.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/subservices')
export class SubserviceController {
  constructor(private readonly subserviceService: SubserviceService) {}

  @Get('list')
  @Render('admin/portal/subservices/list')
  subservicesList() {
    return {
      title: 'Sub Service',
    };
  }

  @Post('list')
  async subserviceListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.subserviceService.getPaginatedList(queryDto);
    console.log('Subservices route hit', result);
    return result;
  }

  @Get('add')
  @Render('admin/portal/subservices/add')
  async addUpdatesubservice(@Query('id') id: string) {
    let title = 'Add Sub Service';
    let is_update = false;
    let action_data = {};
    const services = await this.subserviceService.findServicesAll();
    if (!services || services.length === 0) {
      throw new NotFoundException({
        message: 'Service not found',
      });
    }
    if (id) {
      const checkAdmin = await this.subserviceService.findsubserviceById(id);
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
  async addUpdatesubserviceSubmit(@Body() data: CreateSubserviceDto) {
    await this.subserviceService.addUpdatesubservice(data);
    return {
      message: data.action_id
        ? 'Sub Service has been updated'
        : 'Sub Service has been added',
      redirect: '/admin/subservices/list',
    };
  }

  @Delete()
  async deletesubservice(@Query('id') id: string) {
    return await this.subserviceService.deletesubservice(id);
  }
}
