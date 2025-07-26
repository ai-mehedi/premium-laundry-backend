import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { UserAuth } from 'src/common/types/user-auth.types';
import { User, UserModel } from 'src/models/user.schema';
import { UpdateMeDto } from './dto/update-profile.dto';
import {
  comparePassword,
  hashPassword,
} from 'src/common/helpers/utils/password.utils';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilePictureDto } from './dto/profile-pictures.dto';

@Injectable()
export class MeService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly i18n: I18nService,
  ) { }

  async getMe(user: UserAuth) {
    const userData = await this.userModel
      .findOne({ _id: user.userId, isActive: true })
      .select({
        _id: 1,
        name: 1,
        phone: 1,
        email: 1,
        avatar: 1,
        fullAddress: 1,
      })
      .exec();
    if (!userData) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: { field: 'user' },
        }),
      });
    }
    return {
      message: 'User data retrieved successfully',
      user: userData,
    };
  }

  async updateMe(user: UserAuth, updateData: UpdateMeDto) {
    const userData = await this.userModel.findOneAndUpdate(
      { _id: user.userId, isAccountVerified: true },
      {
        $set: updateData,
      },
    );
    if (!userData) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: { field: 'user' },
        }),
      });
    }

    return {
      message: this.i18n.t('response-messages.profile.updated'),
    };
  }

  async changePassword(
    authUser: UserAuth,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.userModel.findOne({
      _id: authUser.userId,
      isAccountVerified: true,
    });
    if (!user) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: { field: 'user' },
        }),
      });
    }

    const isValidPassword = await comparePassword(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isValidPassword) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.invalid', {
          args: { field: 'password' },
        }),
      });
    }

    user.password = await hashPassword(changePasswordDto.newPassword);
    await user.save();

    return {
      message: this.i18n.t('response-messages.field.updated', {
        args: { field: 'password' },
      }),
    };
  }

  async updateProfilePicture(
    user: UserAuth,
    updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    const users = await this.userModel.findOne({
      _id: user.userId,
      isAccountVerified: true,
    });
    if (!users) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: { field: 'user' },
        }),
      });
    }

    users.avatar = updateProfilePictureDto;
    await users.save();

    return {
      message: this.i18n.t('response-messages.field.updated', {
        args: { field: 'avatar' },
      }),
    };
  }
}
