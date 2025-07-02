import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
