import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateFaceDto } from './dto/paginate-face.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/models/user.schema';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class FaceService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly i18n: I18nService,
  ) {}

  async getPaginatedFaces({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginateFaceDto) {
    const options: PaginationOptions = { page, limit };
    const searchBy = ['firstName', 'lastName', 'email'];

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
      _id: 1,
      firstName: 1,
      lastName: 1,
      intent: 1,
      spaceType: 1,
      avatar: 1,
    };

    const results = await this.userModel.paginate(
      {
        isAccountVerified: true,
        profileStatus: true,
        profileDeleteRequested: { $exists: false },
      },
      options,
    );

    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'faces',
        },
      }),
      result: results,
    };
  }

  async getFaceById(id: string) {
    const face = await this.userModel
      .findOne({
        _id: id,
        isAccountVerified: true,
        profileStatus: true,
        profileDeleteRequested: { $exists: false },
      })
      .select({
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        intent: 1,
        spaceType: 1,
        genderIdentity: 1,
        sexualOrientation: 1,
        age: 1,
        smokeCigarettes: 1,
        smokeMarijuana: 1,
        workFromHome: 1,
        travel: 1,
        cleanliness: 1,
        describeMyselfAs: 1,
        zodiac: 1,
        selfDescription: 1,
        fluentLanguages: 1,
        avatar: 1,
      });

    if (!face) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: {
            field: 'face',
          },
        }),
      });
    }

    return {
      message: this.i18n.t('response-messages.field.retrieved', {
        args: {
          field: 'face',
        },
      }),
      face,
    };
  }
}
