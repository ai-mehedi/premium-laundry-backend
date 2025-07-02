import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { UserAuth } from 'src/common/types/user-auth.types';
import { User, UserModel } from 'src/models/user.schema';
import { UpdateMeDto } from './dto/update-profile.dto';
import {
  NOTIFICATION_PREFERENCE_TYPE,
  UpdateNotificationPreferencesDto,
} from './dto/update-notification-preferences.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  comparePassword,
  hashPassword,
} from 'src/common/helpers/utils/password.utils';
import { DeleteProfileDto } from './dto/delete-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilePictureDto } from './dto/profile-pictures.dto';

@Injectable()
export class MeService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly i18n: I18nService,
  ) {}

  async getMe(user: UserAuth) {
    const userData = await this.userModel
      .findOne({ _id: user.userId, isAccountVerified: true })
      .populate({
        path: 'membership.membershipId',
        select: 'name price duration',
      })
      .select({
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        intent: 1,
        spaceType: 1,
        'membership.membershipId': 1,
        'membership.startDate': 1,
        'membership.endDate': 1,
        'membership.cancelledAt': 1,
        'membership.status': 1,
        genderIdentity: 1,
        createdAt: 1,
        updatedAt: 1,
        avatar: 1,
        phone: 1,
        profileStatus: 1,
        listingStatus: 1,
        notificationPreferences: 1,
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

  async updateNotificationPreferences(
    authUser: UserAuth,
    updateData: UpdateNotificationPreferencesDto,
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

    switch (updateData.type) {
      case NOTIFICATION_PREFERENCE_TYPE.NEW_LISTING:
        user.notificationPreferences.newListing = updateData.enabled;
      case NOTIFICATION_PREFERENCE_TYPE.NEW_MESSAGE:
        user.notificationPreferences.newMessage = updateData.enabled;
      case NOTIFICATION_PREFERENCE_TYPE.FAVORITE_LISTING:
        user.notificationPreferences.favoriteListing = updateData.enabled;
      case NOTIFICATION_PREFERENCE_TYPE.FINISH_PROFILE:
        user.notificationPreferences.finishProfile = updateData.enabled;
      case NOTIFICATION_PREFERENCE_TYPE.FINISH_LISTING:
        user.notificationPreferences.finishListing = updateData.enabled;
      case NOTIFICATION_PREFERENCE_TYPE.CHAT_REQUEST:
        user.notificationPreferences.chatRequest = updateData.enabled;
    }

    await user.save();

    return {
      message: this.i18n.t('response-messages.field.updated', {
        args: { field: 'notification preferences' },
      }),
    };
  }

  async updateStatus(authUser: UserAuth, updateData: UpdateStatusDto) {
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

    switch (updateData.type) {
      case 'profile':
        user.profileStatus = updateData.status;
        break;
      case 'listing':
        user.listingStatus = updateData.status;
        break;
      default:
        throw new NotFoundException({
          message: this.i18n.t('response-messages.field.not_found', {
            args: { field: 'status type' },
          }),
        });
    }

    await user.save();

    return {
      message: this.i18n.t('response-messages.field.updated', {
        args: { field: 'status' },
      }),
    };
  }

  async deleteMe(authUser: UserAuth, deleteProfileDto: DeleteProfileDto) {
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
      deleteProfileDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.invalid', {
          args: { field: 'password' },
        }),
      });
    }

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 7);

    user.profileDeleteRequested = {
      reason: deleteProfileDto.reason,
      scheduledAt: scheduledAt,
    };
    user.profileStatus = false;
    user.listingStatus = false;

    await user.save();

    return {
      message: this.i18n.t('response-messages.profile.delete_scheduled'),
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
