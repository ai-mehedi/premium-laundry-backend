import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/models/user.schema';
import { RandomString } from 'src/common/helpers/utils/string.utils';
import { hashPassword } from 'src/common/helpers/utils/password.utils';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly i18n: I18nService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      phone: signupDto.phone,
    });
    if (existingUser) {
      throw new BadRequestException({
        message: this.i18n.t('response-messages.field.already_exists', {
          args: {
            field: 'phone',
          },
        }),
        field: 'phone',
      });
    }

    const userPassword = RandomString(12);
    const hashPass = await hashPassword(userPassword);

    const user = new this.userModel({
      name: signupDto.name,
      phone: `+88${signupDto.phone}`,
      password: hashPass,
      isActive: true,
    });

    await user.save();

    return {
      message: this.i18n.t('response-messages.registration.success'),
    };
  }
}
