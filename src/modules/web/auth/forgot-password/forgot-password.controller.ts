import { Controller, Post, Body, Put } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth - Forgot Password')
@Controller('web/auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  create(@Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    return this.forgotPasswordService.create(createForgotPasswordDto);
  }

  @Put()
  changePassword(@Body() updateForgotPasswordDto: UpdateForgotPasswordDto) {
    return this.forgotPasswordService.update(updateForgotPasswordDto);
  }
}
