import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { SignupService } from './signup.service';

@ApiTags('Auth - Signup')
@Controller('web/auth/signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  async signup(@Body() signupDto: SignupDto) {
    return await this.signupService.signup(signupDto);
  }
}
