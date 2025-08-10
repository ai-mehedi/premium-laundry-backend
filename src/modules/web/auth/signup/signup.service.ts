import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/models/user.schema';
import { RandomNumberString } from 'src/common/helpers/utils/string.utils';
import { hashPassword } from 'src/common/helpers/utils/password.utils';
import { SEND_SMS_TEMPLATE, SMSService } from 'src/shared/services/sms.service';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly smsService: SMSService,
    private readonly i18n: I18nService,
  ) { }

  async signup(signupDto: SignupDto) {
    const phonenumber = `+88${signupDto.phone}`;
    const userId = RandomNumberString(8);

    const existingUser = await this.userModel.findOne({
      phone: phonenumber
    });
    if (existingUser) {
      throw new BadRequestException({
        message: this.i18n.t('Phone number Already exist!', {
          args: {
            field: 'phone',
          },
        }),
        field: 'phone',
      });
    }

    const hashPass = await hashPassword(signupDto.password);

    const user = new this.userModel({
      name: signupDto.name,
      phone: `+88${signupDto.phone}`,
      password: hashPass,
      userId: userId,
      isActive: true,
    });

    await user.save();

    await this.smsService.sendSMS({
      template: SEND_SMS_TEMPLATE.USER_CREATE,
      phone: user.phone.replace('+', ''),
      payload: {
        NAME: user.name,
        USER_ID: user.userId,
        PASSWORD: signupDto.password, // In production, avoid sending plain passwords
      },
    });


    return {
      message: this.i18n.t('response-messages.registration.success'),
    };
  }
}
