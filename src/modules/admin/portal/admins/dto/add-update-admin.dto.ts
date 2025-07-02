import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AddUpdateAdminDto {
  @IsNotEmpty()
  @MaxLength(24)
  @IsString()
  readonly name: string;

  @IsOptional()
  @MaxLength(100)
  readonly email?: string;

  @IsOptional()
  @MaxLength(32)
  readonly password?: string;

  @IsNotEmpty()
  @IsString()
  roles: string;

  @IsNotEmpty()
  readonly isActive: boolean;

  @IsOptional()
  @IsMongoId()
  readonly action_id?: string;
}
