import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { SPACE_TYPE } from 'src/common/types/space.types';
import { User, UserPreferredLocation } from './user.schema';

export type SpaceListDocument = HydratedDocument<SpaceList>;
mongoose.Schema.Types.String.set('trim', true);

@Schema()
export class SpaceLocation {
  @ApiProperty()
  @Prop({ type: Number, required: true })
  lat: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  long: number;
}

@Schema()
export class SpacePhoto {
  @ApiProperty()
  @Prop({ type: String, required: true })
  originalName: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  fileName: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  fileSize: number;

  @ApiProperty()
  @Prop({ type: String, required: true })
  mimeType: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  filePath: string;
}

@Schema({
  timestamps: true,
})
export class SpaceList {
  @ApiProperty()
  @Prop({
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user: string;

  @ApiProperty()
  @Prop({ enum: SPACE_TYPE, required: true })
  spaceType: SPACE_TYPE;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  fullAddress?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  residenceType?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  size?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  bedrooms?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  bathrooms?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  ownerOccupied?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  numPeopleInHome?: string;

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  amenities?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  parking?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  neighborhood?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  currentPets?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  allowedPets?: string[];

  @ApiProperty({ required: false })
  @Prop({ type: String })
  smokeCigarettes?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  smokeMarijuana?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  overnightGuestsAllowed?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  homeDescription?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  availabilityDate?: string;

  @ApiProperty({ required: false })
  @Prop({ type: Number })
  availabilityDuration?: number;

  @ApiProperty({ required: false })
  @Prop({ type: Number })
  minimumDuration?: number;

  @ApiProperty({ required: false })
  @Prop({ type: Number })
  monthlyRent?: number;

  @ApiProperty({ required: false })
  @Prop({ type: Number })
  depositAmount?: number;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  leaseRequired?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  requiredReferences?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  utilitiesIncluded?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  furnished?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  bedroomSize?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  brightness?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  bathroom?: string;

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  roomFeatures?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  spacePhotos?: string[];

  @ApiProperty({ required: false })
  @Prop({ type: String })
  preferredGenderIdentity?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  preferredSexualOrientation?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  preferredAgeRange?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  idealRoommateDescription?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  idealTenantDescription?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  rentalStartDate?: string;

  @ApiProperty({ required: false })
  @Prop({ type: Number })
  rentalDuration?: number;

  @ApiProperty({ required: false })
  @Prop({ type: Number })
  maxMonthlyBudget?: number;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  willingToSignRentalAgreement?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  wantFurnished?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  pets?: string;

  @ApiProperty({ required: false })
  @Prop({ type: String })
  parkingRequired?: string;

  @ApiProperty({ required: false })
  @Prop({ type: UserPreferredLocation })
  preferredLocation?: UserPreferredLocation;

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  preferredSmokingHabits?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  preferredRoommateGenderIdentity?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  preferredRoommateSexualOrientation?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  preferredRoommateAgeRange?: string[];

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String] })
  preferredRoommateSmokingHabits?: string[];

  @ApiProperty()
  @Prop({ type: SpaceLocation, required: false })
  location?: SpaceLocation;

  @ApiProperty()
  @Prop({ type: [SpacePhoto], required: false })
  photos?: SpacePhoto[];
}

export const SpaceListSchema = SchemaFactory.createForClass(SpaceList);

SpaceListSchema.plugin(paginatePlugin);
SpaceListSchema.plugin(softDeletePlugin);

export type SpaceListModel = PaginateModel<SpaceList> &
  SoftDeleteModel<SpaceList>;
