import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { SPACE_TYPE } from 'src/common/types/space.types';
import { Membership } from './membership-schema';

export type UserDocument = HydratedDocument<User>;
mongoose.Schema.Types.String.set('trim', true);

export enum USER_INTENT {
  FIND = 'find',
  RENT = 'rent',
  BOTH = 'both',
}

export enum USER_VERIFICATION_TYPE {
  EMAIL_VERIFICATION = 'email_verification',
  FORGOT_PASSWORD = 'forgot_password',
  CHANGE_EMAIL = 'change_email',
}

export enum USER_SUBSCRIPTION_STATUS {
  ACTIVE = 'active',
  FAILED_PAYMENT = 'failed_payment',
  CANCELING = 'canceling',
  CANCELED = 'canceled',
}

@Schema()
export class UserAvatar {
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

@Schema({ timestamps: true, _id: true })
export class UserVerificationCodes {
  @Prop({ enum: USER_VERIFICATION_TYPE, required: true })
  verificationType: USER_VERIFICATION_TYPE;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, required: false })
  verificationCode?: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

@Schema()
export class UserPreferredLocation {
  @ApiProperty()
  @Prop({ type: Number, required: true })
  lat: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  long: number;
}

@Schema()
export class UserProfileDeleteRequest {
  @ApiProperty()
  @Prop({ type: String, required: true })
  reason: string;

  @ApiProperty()
  @Prop({ type: Date, required: true })
  scheduledAt: Date;
}

@Schema()
export class UserNotificationPreferences {
  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  newListing: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  newMessage: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  favoriteListing: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  finishProfile: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  finishListing: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  chatRequest: boolean;
}

@Schema()
export class UserMembership {
  @ApiProperty()
  @Prop({
    ref: Membership.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  membershipId: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  subscriptionId: string;

  @ApiProperty()
  @Prop({ type: [String], required: true })
  invoiceIds: string[];

  @ApiProperty()
  @Prop({ type: Date, required: true })
  startDate: Date;

  @ApiProperty()
  @Prop({ type: Date, required: true })
  endDate: Date;

  @ApiProperty()
  @Prop({ type: Date, required: false })
  cancelledAt?: Date;

  @ApiProperty()
  @Prop({ enum: USER_SUBSCRIPTION_STATUS, required: true })
  status: USER_SUBSCRIPTION_STATUS;
}

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({ type: String, required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  lastName: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  phone?: string;

  @ApiProperty()
  @Prop({ enum: USER_INTENT, required: true })
  intent: USER_INTENT;

  @ApiProperty()
  @Prop({ enum: SPACE_TYPE, required: true })
  spaceType: SPACE_TYPE;

  @ApiProperty()
  @Prop({ type: String, required: true })
  genderIdentity: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  sexualOrientation: string;

  @ApiProperty()
  @Prop({ type: Number, required: false })
  age?: number;

  @ApiProperty()
  @Prop({ type: String, required: false })
  smokeCigarettes?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  smokeMarijuana?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  workFromHome?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  travel?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  cleanliness?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  describeMyselfAs?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  zodiac?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  selfDescription?: string;

  @ApiProperty()
  @Prop({ type: [String], required: false })
  fluentLanguages?: string[];

  // The Room
  @ApiProperty()
  @Prop({ type: UserPreferredLocation, required: false })
  preferredLocation?: UserPreferredLocation;

  @ApiProperty()
  @Prop({ type: Date, required: false })
  rentalStartDate?: Date;

  @ApiProperty()
  @Prop({ type: String, required: false })
  willingToSignRentalAgreement?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  wantFurnished?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  bedroom?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  bedroomSize?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  pets?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  parkingRequired?: string;

  // Roommate Preferences
  @ApiProperty()
  @Prop({ type: String, required: false })
  preferredGenderIdentity?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  preferredSexualOrientation?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  preferredAgeRange?: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  preferredSmokingHabits?: string;

  // Others
  @Prop({ type: [UserVerificationCodes], default: [] })
  verificationCodes: UserVerificationCodes[];

  @ApiProperty()
  @Prop({ type: UserAvatar, required: true })
  avatar: UserAvatar;

  @ApiProperty()
  @Prop({ type: UserNotificationPreferences, required: true })
  notificationPreferences: UserNotificationPreferences;

  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  profileStatus: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  listingStatus: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  isAccountVerified: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  isIdVerified: boolean;

  @ApiProperty()
  @Prop({ type: UserProfileDeleteRequest, required: false })
  profileDeleteRequested?: UserProfileDeleteRequest;

  @ApiProperty()
  @Prop({ type: String, required: true })
  stripeCustomerId: string;

  @ApiProperty()
  @Prop({ type: UserMembership, required: false })
  membership?: UserMembership;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(paginatePlugin);
UserSchema.plugin(softDeletePlugin);

export type UserModel = PaginateModel<User> & SoftDeleteModel<User>;
