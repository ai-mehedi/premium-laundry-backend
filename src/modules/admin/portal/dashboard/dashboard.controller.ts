import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';
import { DashboardService } from './dashboard.service';

@Controller('admin/portal/dashboard')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  @Render('admin/portal/dashboard/index')
  async index() {
    const totalAdmins = await this.dashboardService.getAdminCount();

    return {
      title: 'Admin Dashboard',
      data: {
        totalorder: totalAdmins.totalorder,
        completeordertotal: totalAdmins.completeordertotal,
        totalamount: totalAdmins.totalamount,
        Vendorcost: totalAdmins.Vendorcost,
        revenue: totalAdmins.revenue,
        totaluser: totalAdmins.totaluser,
        totalpaymentamount: totalAdmins.totalpaymentamount
      },
    };
  }
}
