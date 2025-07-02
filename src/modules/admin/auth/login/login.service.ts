import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminModel } from 'src/models/admin.schema';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from 'src/common/helpers/utils/password.utils';
import { Response } from 'express';
import { AppConfigService } from 'src/config/app.config';
import { CookieService } from 'src/shared/services/cookie.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
    private readonly appConfigService: AppConfigService,
    private readonly cookieService: CookieService,
  ) {}

  async login(res: Response, loginDto: LoginDto) {
    const user = await this.adminModel.findOne({
      email: loginDto.email,
    });
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        field: 'email',
      });
    }

    if (!user.isActive) {
      throw new NotFoundException({
        message: 'User is not active',
        field: 'email',
      });
    }
    const isPasswordValid = await comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException({
        message: 'Invalid password',
        field: 'password',
      });
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    this.cookieService.setCookie(
      res,
      this.appConfigService.adminSession.key,
      user._id.toString(),
      '7day',
      {
        httpOnly: true,
        secure: false,
        signed: true,
      },
    );

    return {
      message: 'Login successful',
      continue: {
        redirect: '/admin/portal/dashboard',
      },
    };
  }
}
