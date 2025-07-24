import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';


@Controller('admin/portal/orders')

export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('list')
  @Render('admin/portal/orders/list')
  faqsList() {
    return {
      title: 'FAQs',
    };
  }
  
  @Get('invoice')
  @Render('admin/portal/orders/invoice')
  async invoicechek(@Query('id') id: string) {
    const order =await  this.orderService.findAllOrdersById(id);
    console.log(order);
    return {
      order: order,
       
      title: 'FAQs',
    };
  }


  @Post('list')
  async faqsListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.orderService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/orders/add')
  async addUpdateFaq(@Query('id') id: string) {
    const admins = await this.orderService.findAllAdmins();

    let title = 'Add orders';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.orderService.findFaqById(id);
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
      admins: admins,
    };
  }

  @Post('add')
  async addUpdateFaqSubmit(@Body() data: CreateOrderDto) {
    
    await this.orderService.addUpdateFaq(data);
    return {
      message: data.action_id ? 'orders has been updated' : 'orders has been added',
      redirect: '/admin/orders/list',
    };
  }



}
