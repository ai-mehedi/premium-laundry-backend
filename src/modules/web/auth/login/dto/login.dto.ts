import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
