import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { phoneDto } from './dto/order-get.dto'
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('web/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post('by-phone')
  findAll(@Body() phoneDto: phoneDto) {
    return this.orderService.findorderbynumber(phoneDto);
  }
}
