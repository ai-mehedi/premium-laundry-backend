import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfilePictureDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  originalName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileSize: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filePath: string;
}
