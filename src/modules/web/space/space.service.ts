import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { SpaceList, SpaceListModel } from 'src/models/space-list.schema';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginateSpaceDto } from './dto/paginate-space.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserAuth } from 'src/common/types/user-auth.types';
import mongoose from 'mongoose';

@Injectable()
export class SpaceService {
  constructor(
    @InjectModel(SpaceList.name)
    private readonly spaceListModel: SpaceListModel,
    private readonly i18n: I18nService,
  ) {}

  async getPaginatedSpaces({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginateSpaceDto) {
    const options: PaginationOptions = { page, limit };
    const searchBy = [];

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

    options.project = {
      _v: 0,
    };

    const results = await this.spaceListModel.paginate({}, options);

    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'spaces',
        },
      }),
      result: results,
    };
  }

  async getPaginatedSpacesByUser(
    authUser: UserAuth,
    { limit, page, sortBy, sortOrder, searchText }: PaginateSpaceDto,
  ) {
    const options: PaginationOptions = { page, limit };
    const searchBy = [];

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

    options.project = {
      _v: 0,
    };

    const results = await this.spaceListModel.paginate(
      {
        user: new mongoose.Types.ObjectId(authUser.userId),
      },
      options,
    );

    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'spaces',
        },
      }),
      result: results,
    };
  }

  async getSpaceById(id: string) {
    const space = await this.spaceListModel
      .findOne({
        _id: id,
      })
      .select({
        _v: 0,
      });

    if (!space) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: {
            field: 'Space',
          },
        }),
      });
    }

    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'Space',
        },
      }),
      space,
    };
  }

  async createSpace(authUser: UserAuth, createSpaceDto: CreateSpaceDto) {
    const space = new this.spaceListModel({
      user: authUser.userId,
      ...createSpaceDto,
    });
    const savedSpace = await space.save();

    return {
      message: this.i18n.t('response-messages.field.created', {
        args: {
          field: 'Space',
        },
      }),
      space: savedSpace,
    };
  }
}
