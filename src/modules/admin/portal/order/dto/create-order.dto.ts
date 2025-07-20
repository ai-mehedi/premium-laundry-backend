import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    orderstatus: string;
    @ApiProperty()
    @IsNotEmpty()
    note: string;
    @ApiProperty()
    @IsNotEmpty()
    supplier: string; // Assuming this is a MongoDB ObjectId as a string
    @ApiProperty()
    @IsOptional()
    action_id?: string; // Optional field for update operations
}


