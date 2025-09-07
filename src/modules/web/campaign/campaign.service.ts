import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Campaign, CampaignModel } from 'src/models/campaign.schema';

@Injectable()
export class CampaignService {

  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: CampaignModel,
    private readonly i18n: I18nService,
  ) { }

  async findAll() {
    return this.campaignModel.findOne({ isActive: true })
  }

}
