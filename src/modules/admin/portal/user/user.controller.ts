import { Controller, Get, Post, Render, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/users')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('list')
  @Render('admin/portal/users/list')
  usersList() {
    return {
      title: 'Users',
    };
  }

  @Post('list')
  async usersListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.UserService.getUserPaginatedList(queryDto);
    return result;
  }
}
