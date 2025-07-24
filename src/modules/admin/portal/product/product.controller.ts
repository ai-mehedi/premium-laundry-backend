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
import { Productervice } from './product.service';
import { CreateProductitemDto } from './dto/create-productitem.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/products')
export class ProductitemController {
  constructor(private readonly Productervice: Productervice) { }

  @Get('list')
  @Render('admin/portal/products/list')
  subservicesList() {
    return {
      title: 'Product Item',
    };
  }

  @Post('list')
  async subserviceListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.Productervice.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/products/add')
  async addUpdateProduct(@Query('id') id: string) {
    let title = 'Add Product Item';
    let is_update = false;
    let action_data = {};

    const services = await this.Productervice.findServicesAll();
    if (!services || services.length === 0) {
      throw new NotFoundException({
        message: 'Service not found',
      });
    }
    const itemtype = await this.Productervice.finditemtypeAll();

    if (!itemtype || itemtype.length === 0) {
    
      throw new NotFoundException({
        message: 'Sub Service not found',
      });
    }

    if (id) {

      const checkAdmin =
        await this.Productervice.findsubproductItemById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Product Item not found',
        });
      }

      title = 'Update Product Item';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    console.log('action_data', action_data);
    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
      services: services,
      itemtype: itemtype,
    };
  }

  @Post('add')
  async addUpdatesubserviceSubmit(@Body() data: CreateProductitemDto) {
    await this.Productervice.addUpdateproductItem(data);
    return {
      message: data.action_id
        ? 'Sub Service has been updated'
        : 'Sub Service has been added',
      redirect: '/admin/products/list',
    };
  }

  @Delete()
  async deletesubservice(@Query('id') id: string) {
    return await this.Productervice.deleteProductitem(id);
  }
}
