import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductitemDto {
  @ApiProperty({ example: 'TROUSER/PENT' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ example: '64ef12ab9fc4e2d2f99c1111' })
  @IsMongoId()
  serviceId: string;

  @ApiProperty({ example: '64ef12ab9fc4e2d2f99c2222' })
  @IsMongoId()
  itemtypeID: string;

  @ApiProperty()
  @IsNotEmpty()
  pwashAndIron: number;
  @ApiProperty()
  @IsNotEmpty()
  pedrycleaning: number;
  @ApiProperty()
  @IsNotEmpty()
  piron: number;
  @ApiProperty()
  @IsNotEmpty()
  vwashAndIron: number;
  @ApiProperty()
  @IsNotEmpty()
  vdrycleaning: number;
  @ApiProperty()
  @IsNotEmpty()
  viron: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  readonly action_id?: string;
}
