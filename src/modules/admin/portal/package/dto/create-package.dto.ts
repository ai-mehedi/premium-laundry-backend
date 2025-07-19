
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePackageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    thumbnail: string;
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    readonly action_id?: string;
}
