import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SortOrderDirection } from '../plugins/mongoose-plugin/pagination/types';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({
    minimum: 1,
    title: 'Page',
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    default: 1,
    type: 'integer',
    required: false,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({
    minimum: 10,
    maximum: 50,
    title: 'Limit',
    default: 10,
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value > 50 ? 50 : value))
  @Transform(({ value }) => (value < 10 ? 10 : value))
  @IsInt()
  @Min(10)
  @Max(50)
  limit = 10;

  @ApiProperty({
    title: 'Search',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiProperty({
    title: 'Sort By Field',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  sortBy = 'createdAt';

  @ApiProperty({
    title: 'Sorting Order for Field',
    required: false,
    type: SortOrderDirection,
  })
  @IsOptional()
  @IsEnum(SortOrderDirection)
  sortOrder = SortOrderDirection.DESC;

  @ApiProperty({
    title: 'Search Keywords',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
