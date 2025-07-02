import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;
}
