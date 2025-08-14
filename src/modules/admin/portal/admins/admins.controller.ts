import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AddUpdateAdminDto } from './dto/add-update-admin.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/admins')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('list')
  @Render('admin/portal/admins/list')
  adminsList() {
    return {
      title: 'Admins',
    };
  }

  @Post('list')
  async adminsListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.adminsService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/admins/add')
  async addUpdateAdmin(@Query('id') id: string) {
    let title = 'Add Admin';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.adminsService.findAdminById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Admin not found',
        });
      }
      title = 'Update Admin';
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
  async addUpdateAdminSubmit(@Body() data: AddUpdateAdminDto) {
    await this.adminsService.addUpdateAdmin(data);
    return {
      message: data.action_id
        ? 'Admin has been updated'
        : 'Admin has been added',
      continue: {
        redirect: '/admin/portal/admins/list',
      },
    };
  }
}
