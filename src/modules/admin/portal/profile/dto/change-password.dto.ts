import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MaxLength(32)
  @IsString()
  readonly current_password: string;

  @IsNotEmpty()
  @MaxLength(32)
  @IsString()
  readonly new_password: string;

  @IsNotEmpty()
  @MaxLength(32)
  @IsString()
  readonly confirm_password: string;
}
