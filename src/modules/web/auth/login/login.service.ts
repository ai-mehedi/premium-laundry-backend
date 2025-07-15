import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/models/user.schema';
import { LoginDto } from './dto/login.dto';
import { I18nService } from 'nestjs-i18n';
import { comparePassword } from 'src/common/helpers/utils/password.utils';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app.config';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async login(bodyDto: LoginDto) {
    const user = await this.userModel.findOne({
      phone: `+88${bodyDto.phone}`,
    });

    if (!user) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_found', {
          args: { field: 'phone' },
        }),
      });
    }

    if (!user.isActive) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.not_verified', {
          args: { field: 'phone' },
        }),
      });
    }

    const isPasswordValid = await comparePassword(
      bodyDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException({
        message: this.i18n.t('response-messages.field.invalid', {
          args: { field: 'password' },
        }),
      });
    }

    const token = this.jwtService.sign(
      {
        userId: user._id,
        name: user.name,
        email: user?.email,
        phone: user.phone,
        avatar: user?.avatar,
      },
      {
        secret: this.appConfigService.jwt.secret,
        expiresIn: '7d',
      },
    );

    return {
      message: this.i18n.t('response-messages.login.success'),
      token,
    };
  }
}
