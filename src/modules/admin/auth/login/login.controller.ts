import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { Response } from 'express';

@Controller('admin/auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  @Render('admin/auth/login')
  async login() {
    return {
      title: 'Admin Login',
    };
  }

  @Post()
  async handleLogin(@Res() res: Response, @Body() loginDto: LoginDto) {
    const result = await this.loginService.login(res, loginDto);
    res.status(200).json(result);
  }
}
