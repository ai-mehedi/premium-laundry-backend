
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCouponDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    discountCode?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    percentage?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    maximumAttendeeCapacity?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    totalamount?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    expierationDate?: Date;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    readonly action_id?: string;
}
