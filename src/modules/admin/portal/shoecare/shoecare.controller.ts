import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoecareService } from './shoecare.service';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';

@Controller('shoecare')
export class ShoecareController {
  constructor(private readonly shoecareService: ShoecareService) {}

  @Post()
  create(@Body() createShoecareDto: CreateShoecareDto) {
    return this.shoecareService.create(createShoecareDto);
  }

  @Get()
  findAll() {
    return this.shoecareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoecareService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoecareDto: UpdateShoecareDto) {
    return this.shoecareService.update(+id, updateShoecareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoecareService.remove(+id);
  }
}
