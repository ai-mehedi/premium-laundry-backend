
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    ValidateNested,
} from 'class-validator';

class OrderServiceDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    service: string;

    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    price: number;
}

class OrderProductDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    id?: string; // optional _id of product (if exists)

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    productName: string;

    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    quantity: number;

    @ApiProperty({ type: [OrderServiceDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderServiceDto)
    services: OrderServiceDto[];

    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    subtotal: number;
}


export class UpdateOrderDto {


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    delivery: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    promoCode?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    subtotal: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    total: number;

    @ApiProperty({ type: [OrderProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderProductDto)
    products: OrderProductDto[];

    @ApiProperty()
    @IsOptional()
    @IsString()
    OrderStatus?: string;
}
