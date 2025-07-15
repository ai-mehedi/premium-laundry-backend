import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';
import { User, UserModel } from 'src/models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SEND_SMS_TEMPLATE, SMSService } from 'src/shared/services/sms.service';
import { getRandomInt } from 'src/common/helpers/utils/int.utils';
import { hashPassword } from 'src/common/helpers/utils/password.utils';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    private readonly smsService: SMSService,
  ) {}

  async create(createForgotPasswordDto: CreateForgotPasswordDto) {
    const user = await this.userModel.findOne({
      phone: `+88${createForgotPasswordDto.phone}`,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const otpCode = getRandomInt(100000, 999999);
    try {
      await this.smsService.sendSMS({
        template: SEND_SMS_TEMPLATE.FORGOT_PASSWORD,
        phone: user.phone.replace('+', ''),
        payload: {
          name: user.name,
          code: otpCode,
        },
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }

    const exp = new Date();
    exp.setMinutes(exp.getMinutes() + 10);

    user.forgotPassword = {
      code: otpCode.toString(),
      maxRetry: 5,
      expiresAt: exp,
    };
    await user.save();

    return {
      message: 'Forgot password request created successfully',
    };
  }

  async update(updateForgotPasswordDto: UpdateForgotPasswordDto) {
    const user = await this.userModel.findOne({
      phone: `+88${updateForgotPasswordDto.phone}`,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    if (
      !user?.forgotPassword ||
      user.forgotPassword.maxRetry <= 0 ||
      user.forgotPassword.expiresAt < new Date()
    ) {
      throw new NotFoundException({
        message: 'Forgot password request not found or expired',
      });
    }

    if (user.forgotPassword.code !== updateForgotPasswordDto.otpCode) {
      user.forgotPassword.maxRetry -= 1;
      await user.save();
      throw new NotFoundException({
        message: 'Invalid OTP code',
      });
    }

    const hashP = await hashPassword(updateForgotPasswordDto.password);
    user.password = hashP;
    user.forgotPassword = null;
    await user.save();

    return {
      message: 'Password updated successfully',
    };
  }
}
