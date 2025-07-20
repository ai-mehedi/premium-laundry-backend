import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateVendorDto {

    @ApiProperty()
    @IsNotEmpty()
    status: string;
    
    @ApiProperty()
    @IsNotEmpty()
    updatedBy: string;

    @ApiProperty()
    @IsNotEmpty()
    note: string;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    readonly action_id?: string;


}
