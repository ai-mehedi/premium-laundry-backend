import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { DeliverypanelService } from './deliverypanel.service';
import { CreateDeliverypanelDto } from './dto/create-deliverypanel.dto';
import { UpdateDeliverypanelDto } from './dto/update-deliverypanel.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/deliverypanel')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR, ADMIN_ROLE.SUPPLIER)
export class DeliverypanelController {
  constructor(private readonly deliverypanelService: DeliverypanelService) { }

  @Get('list')
  @Render('admin/portal/deliverypanel/list')
  deliveryPanelList() {
    return {
      title: 'Delivery Panel',
    };
  }

  @Post('list')
  async deliveryPanelCompleted(@Query() queryDto: PaginationQuery) {
    const result = await this.deliverypanelService.getPaginatedList(queryDto);
    return result;
  }


  @Get('completed')
  @Render('admin/portal/deliverypanel/completeorder')
  deliveryPanelCompleteda() {
    return {
      title: 'Delivery Panel',
    };
  }

  @Post('completed')
  async deliveryPanelListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.deliverypanelService.getPaginatedorderComplete(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/deliverypanel/add')
  async addUpdateDeliverypanel(@Query('id') id: string) {
    let title = 'Add Delivery Panel';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.deliverypanelService.findorderById(id);

      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Delivery panel not found',
        });
      }
      title = 'Update Delivery Panel';
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
  async addUpdateDeliverypanelSubmit(@Body() data: CreateDeliverypanelDto) {
   
    await this.deliverypanelService.addUpdateDeliverypanel(data);
    return {
      redirect: '/admin/portal/deliverypanel/list',
    };
  }
}
