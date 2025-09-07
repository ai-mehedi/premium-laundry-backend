import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Campaigns')
@Controller('web/campaign')

export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }


  @Get()
  async findAll() {
    const campaigns = await this.campaignService.findAll();
    if (!campaigns) {
      return {
        success: false,
        message: 'No active campaigns found',
      };
    }
    return {
      success: true,
      data: campaigns,
    };
  }

}
