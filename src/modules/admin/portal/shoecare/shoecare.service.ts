import { Injectable } from '@nestjs/common';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';

@Injectable()
export class ShoecareService {
  create(createShoecareDto: CreateShoecareDto) {
    return 'This action adds a new shoecare';
  }

  findAll() {
    return `This action returns all shoecare`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoecare`;
  }

  update(id: number, updateShoecareDto: UpdateShoecareDto) {
    return `This action updates a #${id} shoecare`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoecare`;
  }
}
