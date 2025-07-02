import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  LocationDto,
  SignupImageFileDto,
} from '../../auth/signup/dto/signup.dto';
import { Type } from 'class-transformer';
import { SPACE_TYPE } from 'src/common/types/space.types';

export class CreateSpaceDto {
  @ApiProperty({ enum: SPACE_TYPE })
  @IsNotEmpty()
  @IsEnum(SPACE_TYPE)
  spaceType: SPACE_TYPE;

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
