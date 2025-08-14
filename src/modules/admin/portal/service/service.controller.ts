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
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/services')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Get('list')
  @Render('admin/portal/services/list')
  SercvicesList() {
    return {
      title: 'services',
    };
  }

  @Post('list')
  async ServicesListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.serviceService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/services/add')
  async addUpdateService(@Query('id') id: string) {
    let title = 'Add service';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.serviceService.findServiceById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'service not found',
        });
      }
      title = 'Update service';
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
  async addUpdateServiceSubmit(@Body() data: CreateServiceDto) {
    await this.serviceService.addUpdateServices(data);
    return {
      message: data.action_id
        ? 'service has been updated'
        : 'service has been added',
      redirect: '/admin/services/list',
    };
  }

  @Delete()
  async deleteService(@Query('id') id: string) {
    return await this.serviceService.deleteService(id);
  }
}
