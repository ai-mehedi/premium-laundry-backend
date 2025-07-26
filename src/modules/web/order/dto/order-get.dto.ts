import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class phoneDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;
}
