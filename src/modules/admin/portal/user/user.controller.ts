import { Controller, Get, Post, Render, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/users')
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
