import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoecareService } from './shoecare.service';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shoecare')
@Controller('web/shoecare')
export class ShoecareController {
  constructor(private readonly shoecareService: ShoecareService) { }
  @Post()
  shoecareCreate(@Body() createShoecareDto: CreateShoecareDto) {
    return this.shoecareService.create(createShoecareDto);
  }
}
