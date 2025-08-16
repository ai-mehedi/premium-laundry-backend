import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    pickupdate: Date;

    @ApiProperty()
    @IsNotEmpty()
    pickuptime: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    services: string;
    
    @ApiProperty()
    @IsNotEmpty()
    status: string;


    @ApiProperty()
    @IsNotEmpty()
    orderid: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    payableamount: string;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    readonly action_id?: string;
}
