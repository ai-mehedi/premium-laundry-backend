

import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestimonialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

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
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    readonly action_id?: string;
}
