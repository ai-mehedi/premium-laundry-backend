import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Render, Query, NotFoundException } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/campaign')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get('list')
  @Render('admin/portal/campaign/list')
  campaignList() {
    return {
      title: 'Campaigns',
    };
  }

  @Post('list')
  async campaignListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.campaignService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/campaign/add')
  async addUpdateCampaign(@Query('id') id: string) {
    let title = 'Add Campaign';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.campaignService.findCampaignById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Campaign not found',
        });
      }
      title = 'Update Campaign';
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
  async addUpdateCampaignSubmit(@Body() data: CreateCampaignDto) {
    await this.campaignService.addUpdateCampaign(data);
    return {
      message: data.action_id ? 'Campaign has been updated' : 'Campaign has been added',
      redirect: '/admin/campaigns/list',
    };
  }

  @Delete()
  async deleteCampaign(@Query('id') id: string) {
    return await this.campaignService.deleteCampaign(id);
  }
}
