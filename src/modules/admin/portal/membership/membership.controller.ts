import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Controller('admin/portal/memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('list')
  @Render('admin/portal/memberships/list')
  membershipList() {
    return {
      title: 'Memberships',
    };
  }

  @Post('list')
  async membershipListPaginated(@Query() queryDto: PaginationQuery) {
    const result =
      await this.membershipService.membershipListPaginated(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/memberships/add')
  async addUpdateMembership(@Query('id') id: string) {
    let title = 'Add Membership';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.membershipService.findMembershipById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Membership not found',
        });
      }
      title = 'Update Membership';
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
  async addUpdateMemberShipSubmit(@Body() data: CreateMembershipDto) {
    await this.membershipService.addUpdateMemberShipSubmit(data);
    return {
      message: data.action_id
        ? 'Membership has been updated'
        : 'Membership has been added',
      continue: {
        redirect: '/admin/portal/memberships/list',
      },
    };
  }
}
