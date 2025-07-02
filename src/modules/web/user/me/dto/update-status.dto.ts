import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export enum UPDATE_STATUS_TYPE {
  PROFILE = 'profile',
  LISTING = 'listing',
}

export class UpdateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UPDATE_STATUS_TYPE)
  type: UPDATE_STATUS_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
