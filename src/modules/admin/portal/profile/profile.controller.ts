import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminAuthDataParam } from 'src/common/decorators/admin-auth-data.decorator';
import { AdminDocument } from 'src/models/admin.schema';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/profile')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR,ADMIN_ROLE.VENDOR,ADMIN_ROLE.SUPPLIER)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Render('admin/portal/profile/index')
  profile() {
    return {
      title: 'My Profile',
    };
  }

  @Get('update')
  @Render('admin/portal/profile/update')
  update() {
    return {
      title: 'Update Profile',
    };
  }

  @Post('update')
  async submitUpdateProfile(
    @AdminAuthDataParam() authData: AdminDocument,
    @Body() data: UpdateProfileDto,
  ) {
    await this.profileService.updateProfile(authData, data);
    return {
      message: 'Profile has been updated',
    };
  }

  @Get('change-password')
  @Render('admin/portal/profile/change-password')
  changePassword() {
    return {
      title: 'Change Password',
    };
  }

  @Post('change-password')
  async changePasswordSubmit(
    @AdminAuthDataParam() authData: AdminDocument,
    @Body() data: ChangePasswordDto,
  ) {
    await this.profileService.changePassword(authData, data);
    return {
      message: 'Password has been changed',
    };
  }

  @Get('logout')
  logoutAdmin(@Res() res: Response) {
    this.profileService.logoutAdmin(res);
    return res.redirect('/admin/auth/login');
  }
}
