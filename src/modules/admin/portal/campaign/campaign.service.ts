import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign, CampaignModel } from 'src/models/campaign.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';

@Injectable()
export class CampaignService {
constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: CampaignModel,
  ) {}


  async findCampaignById(_id: string) {
    return this.campaignModel.findById(_id);
  }

  async addUpdateCampaign(data: CreateCampaignDto) {
    if (data.action_id) {
      const checkCampaign = await this.campaignModel.findOne({ _id: data.action_id });
      if (!checkCampaign) {
        throw new BadRequestException({
          message: 'Campaign does not exist.',
          field: 'action_id',
        });
      }

      await this.campaignModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            title: data.title,
            thumbnail: data.thumbnail,
            isActive: data.isActive,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.campaignModel.findOne({ _id: data.action_id });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Campaign already exists.',
          field: 'action_id',
        });
      }
      await this.campaignModel.create({
        title: data.title,
        thumbnail: data.thumbnail,
        isActive: data.isActive,
      });
    }
  }

  async getPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/campaign/widgets/list.ejs';
    const searchBy = ['title'];

    limit = limit || 25;
    pagination.per_page = limit;
    const offset = (page - 1) * limit;

    options.sortOrder = {
      direction: sortOrder,
      id: sortBy,
    };

    if (searchText) {
      options.search = {
        searchText,
        searchBy,
      };
    }

    const results = await this.campaignModel.paginate({}, options);

    const paginate_ui = pagination.getAllPageLinks(
      Math.ceil(results.total / limit),
      Math.abs(results.page),
    );

    let html_data = '';
    let serial_number = offset;

    for (const result of results.records) {
      serial_number++;
      html_data += await RenderEjsFile(join(global.ROOT_DIR, renderPath), {
        result,
        serial_number,
      });
    }

    return {
      data_exist: results.total > 0,
      data: html_data,
      total_count: results.total,
      pagination: paginate_ui,
    };
  }

  async deleteCampaign(id: string) {
    const result = await this.campaignModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Campaign not found',
      });
    }
    return {
      message: 'Campaign deleted successfully',
    };
  }
}

      