import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { UserParam } from 'src/common/decorators/user-param.decorator';
import { UserAuth } from 'src/common/types/user-auth.types';
import { UserAuthGuard } from 'src/common/guards/user-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateMeDto } from './dto/update-profile.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DeleteProfileDto } from './dto/delete-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfilePictureDto } from './dto/profile-pictures.dto';

@ApiTags('Web - User - Me')
@Controller('web/user/me')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class MeController {
  constructor(private readonly MeService: MeService) {}

  @Get()
  async getMe(@UserParam() user: UserAuth) {
    return this.MeService.getMe(user);
  }

  @Patch()
  async updateMe(@UserParam() user: UserAuth, @Body() updateData: UpdateMeDto) {
    return this.MeService.updateMe(user, updateData);
  }

  @Patch('notification-preferences')
  async updateNotificationPreferences(
    @UserParam() user: UserAuth,
    @Body() updateData: UpdateNotificationPreferencesDto,
  ) {
    return this.MeService.updateNotificationPreferences(user, updateData);
  }

  @Patch('status')
  async updateStatus(
    @UserParam() user: UserAuth,
    @Body() updateData: UpdateStatusDto,
  ) {
    return this.MeService.updateStatus(user, updateData);
  }

  @Patch('change-password')
  async changePassword(
    @UserParam() user: UserAuth,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.MeService.changePassword(user, changePasswordDto);
  }

  @Patch('profile-picture')
  async updateProfilePicture(
    @UserParam() user: UserAuth,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    return this.MeService.updateProfilePicture(user, updateProfilePictureDto);
  }

  @Patch('delete')
  async deleteMe(
    @UserParam() user: UserAuth,
    @Body() deleteProfileDto: DeleteProfileDto,
  ) {
    return this.MeService.deleteMe(user, deleteProfileDto);
  }
}
