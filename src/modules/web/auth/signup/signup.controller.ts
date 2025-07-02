import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { SignupService } from './signup.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CheckEmailDto } from './dto/check-email.dto';

@ApiTags('Auth - Signup')
@Controller('web/auth/signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  async signup(@Body() signupDto: SignupDto) {
    return await this.signupService.signup(signupDto);
  }

  @Get('check-email')
  async checkEmail(@Body() bodyDto: CheckEmailDto) {
    return await this.signupService.checkEmail(bodyDto);
  }

  @Patch('verify-email')
  async verifyEmail(@Body() bodyDto: VerifyEmailDto) {
    return await this.signupService.verifyEmail(bodyDto);
  }
}
