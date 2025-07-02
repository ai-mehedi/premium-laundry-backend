import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SPACE_TYPE } from 'src/common/types/space.types';
import { USER_INTENT } from 'src/models/user.schema';

export class SignupImageFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  originalName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
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

export class LocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  long: number;
}

export class SignupUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: USER_INTENT })
  @IsNotEmpty()
  @IsEnum(USER_INTENT)
  intent: USER_INTENT;

  @ApiProperty({ enum: SPACE_TYPE })
  @IsNotEmpty()
  @IsEnum(SPACE_TYPE)
  spaceType: SPACE_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => SignupImageFileDto)
  avatar: SignupImageFileDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  genderIdentity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sexualOrientation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  age: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  SmokeCigarettes: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  SmokeMarijuana: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workFromHome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  travel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cleanliness: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  describeMyselfAs: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zodiac?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  selfDescription: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fluentLanguages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => LocationDto)
  preferredLocation?: LocationDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  rentalStartDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  willingToSignRentalAgreement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wantFurnished?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bedroom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bedroomSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pets?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parkingRequired?: string;

  @ApiPropertyOptional()
  @IsOptional()
  preferredGenderIdentity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  preferredSexualOrientation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  preferredAgeRange?: string;

  @ApiPropertyOptional()
  @IsOptional()
  preferredSmokingHabits?: string;
}

export class SignupPropertyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  residenceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bedrooms?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bathrooms?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerOccupied?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numPeopleInHome?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  parking?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  neighborhood?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  currentPets?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  allowedPets?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smokeCigarettes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smokeMarijuana?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overnightGuestsAllowed?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  availabilityDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  availabilityDuration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minimumDuration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  monthlyRent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  depositAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  leaseRequired?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requiredReferences?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  utilitiesIncluded?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  furnished?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bedroomSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brightness?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bathroom?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  roomFeatures?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  spacePhotos?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredGenderIdentity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredSexualOrientation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredAgeRange?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idealRoommateDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idealTenantDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rentalStartDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rentalDuration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxMonthlyBudget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  willingToSignRentalAgreement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wantFurnished?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pets?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parkingRequired?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredLocation?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  preferredSmokingHabits?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  preferredRoommateGenderIdentity?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  preferredRoommateSexualOrientation?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  preferredRoommateAgeRange?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  preferredRoommateSmokingHabits?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignupImageFileDto)
  photos?: SignupImageFileDto[];
}

export class SignupDto {
  @ApiProperty({ type: SignupUserDto })
  @IsNotEmpty()
  @Type(() => SignupUserDto)
  user: SignupUserDto;

  @ApiProperty({ type: SignupPropertyDto })
  @ValidateIf((o) => o.intent === USER_INTENT.RENT)
  @IsNotEmpty()
  @Type(() => SignupPropertyDto)
  property?: SignupPropertyDto;
}
