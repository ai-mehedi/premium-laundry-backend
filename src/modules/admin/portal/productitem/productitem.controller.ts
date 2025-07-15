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
import { ProductitemService } from './productitem.service';
import { CreateProductitemDto } from './dto/create-productitem.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/productitems')
export class ProductitemController {
  constructor(private readonly productitemService: ProductitemService) {}

  @Get('list')
  @Render('admin/portal/productitems/list')
  subservicesList() {
    return {
      title: 'Product Item',
    };
  }

  @Post('list')
  async subserviceListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.productitemService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/productitems/add')
  async addUpdateproductitems(@Query('id') id: string) {
    let title = 'Add Product Item';
    let is_update = false;
    let action_data = {};

    const services = await this.productitemService.findServicesAll();
    if (!services || services.length === 0) {
      throw new NotFoundException({
        message: 'Service not found',
      });
    }
    const subservices = await this.productitemService.findsubServicesAll();
    if (!subservices || subservices.length === 0) {
      throw new NotFoundException({
        message: 'Sub Service not found',
      });
    }

    if (id) {
      console.log('ID:', id);
      const checkAdmin =
        await this.productitemService.findsubproductItemById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Product Item not found',
        });
      }

      title = 'Update Product Item';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
      services: services,
      subservices: subservices,
    };
  }

  @Post('add')
  async addUpdatesubserviceSubmit(@Body() data: CreateProductitemDto) {
    await this.productitemService.addUpdateproductItem(data);
    return {
      message: data.action_id
        ? 'Sub Service has been updated'
        : 'Sub Service has been added',
      redirect: '/admin/productitems/list',
    };
  }

  @Delete()
  async deletesubservice(@Query('id') id: string) {
    return await this.productitemService.deleteProductitem(id);
  }
}
