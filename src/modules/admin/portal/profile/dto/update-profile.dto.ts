import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
