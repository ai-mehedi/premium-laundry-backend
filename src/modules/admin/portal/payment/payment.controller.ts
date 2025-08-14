import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/payments')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR )
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }
  @Get('list')
  @Render('admin/portal/payments/list')
  PaymentList() {
    return {
      title: 'Payment',
    };
  }
  @Post('list')
  async PaymentListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.paymentService.getPaginatedList(queryDto);
    return result;
  }


  

  @Get('add')
  @Render('admin/portal/payments/add')
  async addUpdatePayment(@Query('id') id: string) {
    let title = 'Add Payment';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.paymentService.findPaymentById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Payment not found',
        });
      }
      title = 'Update Payment';
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
  async addUpdatePaymentSubmit(@Body() data: CreatePaymentDto) {
    console.log(data);
    await this.paymentService.addUpdatePayment(data);
    return {
      message: data.action_id
        ? 'Payment has been updated'
        : 'Payment has been added',
      redirect: '/admin/portal/payments/list',
    };
  }

  @Delete()
  async deletePayment(@Query('id') id: string) {
    return await this.paymentService.deletePayment(id);
  }
}
