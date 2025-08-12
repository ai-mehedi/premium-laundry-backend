
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    invoice?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    paymentMethod: string;

    @ApiProperty()
    @IsString()
    transactionId?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    paymentDate: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    readonly action_id?: string;
}
