import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OTPdto } from './dto/otp.dto';
import { phoneDto } from './dto/order-get.dto'
import { ApiTags } from '@nestjs/swagger';
import { OrderStatusDto } from './dto/orderstatuse.dto';
import { UpdateOrderDto } from './dto/update.dto';

@ApiTags('Order')
@Controller('web/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }


  @Post('orderupdate/:id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    console.log('updateOrderDto', updateOrderDto);
    
    return this.orderService.updateorder(id, updateOrderDto);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post('by-phone')
  findAll(@Body() phoneDto: phoneDto) {
    return this.orderService.findorderbynumber(phoneDto);
  }

  @Post('orderotp')
  otpset(@Body() otpDTO: OTPdto) {
    return this.orderService.otpset(otpDTO);
  }

  @Post('orderstatus')
  updateOrderStatus(@Body() orderstatus: OrderStatusDto) {
    return this.orderService.OrderTracking(orderstatus);
  }


}
