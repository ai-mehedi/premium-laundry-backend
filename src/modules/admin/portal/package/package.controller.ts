import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';


@Controller('admin/portal/packages')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class PackageController {
  constructor(private readonly packageService: PackageService) { }
  @Get('list')
  @Render('admin/portal/packages/list')
  CategoriesList() {
    return {
      title: 'categories',
    };
  }
  @Post('list')
  async PackageListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.packageService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/packages/add')
  async addUpdatePackage(@Query('id') id: string) {
    let title = 'Add Package';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.packageService.findPackageById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Package not found',
        });
      }
      title = 'Update Package';
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
  async addUpdateServiceSubmit(@Body() data: CreatePackageDto) {
    await this.packageService.addUpdatePackage(data);
    return {
      message: data.action_id
        ? 'Package has been updated'
        : 'Package has been added',
      redirect: '/admin/packages/list',
    };
  }

  @Delete()
  async deleteService(@Query('id') id: string) {
    return await this.packageService.deletePackage(id);
  }
}
