import { PartialType } from '@nestjs/swagger';
import { CreateShoecareDto } from './create-shoecare.dto';

export class UpdateShoecareDto extends PartialType(CreateShoecareDto) {}
