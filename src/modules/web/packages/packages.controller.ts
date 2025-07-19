import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('packages')
@Controller('web/packages')

export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Get()
  findAllFAQs() {
    return this.packagesService.findAll();
  }

}
