import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }
  @Get('list')
  @Render('admin/portal/vendors/list')
  faqsList() {
    return {
      title: 'vendors',
    };
  }


  @Get('invoice')
  @Render('admin/portal/vendors/invoice')
  async invoicechek(@Query('id') id: string) {
   
    return {

       
      title: 'FAQs',
    };
  }

  @Post('list')
  async faqsListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.vendorService.getPaginatedList(queryDto);
    return result;
  }

  @Get('complete')
  @Render('admin/portal/vendors/complete')
  vendordispatch() {
    return {
      title: 'vendors',
    };
  }


  @Post('complete')
  async vendorcomplte(@Query() queryDto: PaginationQuery) {
    const result = await this.vendorService.getPaginatedcomplted(queryDto);
    return result;
  }
  

  @Get('process')
  @Render('admin/portal/vendors/process')
  vendorprocess() {
    return {
      title: 'vendors process',
    };
  }


  @Post('process')
  async vendorprocessorder(@Query() queryDto: PaginationQuery) {
    const result = await this.vendorService.getPaginatedprocess(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/vendors/add')
  async addUpdateFaq(@Query('id') id: string) {
    let title = 'Add orders';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.vendorService.findFaqById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'orders not found',
        });
      }
      title = 'Update orders';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
    };
  }

  @Post('add')
  async addUpdateFaqSubmit(@Body() data: CreateVendorDto) {
    await this.vendorService.addUpdateFaq(data);
    return {
      message: data.action_id ? 'orders has been updated' : 'orders has been added',
      redirect: '/admin/vendors/list',
    };
  }
}
