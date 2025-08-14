

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateShoecareDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pickupdate: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pickuptime: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
}
