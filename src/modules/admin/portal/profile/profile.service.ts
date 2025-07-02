import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  comparePassword,
  hashPassword,
} from 'src/common/helpers/utils/password.utils';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument, AdminModel } from 'src/models/admin.schema';
import { CookieService } from 'src/shared/services/cookie.service';
import { AppConfigService } from 'src/config/app.config';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
    private readonly cookieService: CookieService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async updateProfile(authData: AdminDocument, data: UpdateProfileDto) {
    await this.adminModel.updateOne(
      {
        _id: authData._id,
      },
      {
        $set: data,
      },
    );
  }
  async changePassword(authData: AdminDocument, data: ChangePasswordDto) {
    const user = await this.adminModel.findOne(authData._id);
    if (!user) {
      throw new BadRequestException({
        message: 'User does not exist',
        field: 'current_password',
      });
    }

    const checkPassword = await comparePassword(
      data.current_password,
      user.password,
    );
    if (!checkPassword) {
      throw new BadRequestException({
        message: 'Password is wrong',
        field: 'current_password',
      });
    }

    if (data.new_password !== data.confirm_password) {
      throw new BadRequestException({
        message: 'Confirm password does not match',
        field: 'confirm_password',
      });
    }

    const has_password = await hashPassword(data.confirm_password);

    await this.adminModel.updateOne(
      {
        _id: authData._id,
      },
      {
        $set: {
          password: has_password,
        },
      },
    );
  }

  logoutAdmin(res: Response) {
    this.cookieService.clearCookie(res, this.appConfigService.adminSession.key);
  }
}
