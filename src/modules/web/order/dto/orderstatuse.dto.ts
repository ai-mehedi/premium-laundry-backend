import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class OrderStatusDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    orderId: string;
}
