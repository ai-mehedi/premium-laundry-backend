import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  USER_INTENT,
  USER_VERIFICATION_TYPE,
  UserModel,
} from 'src/models/user.schema';
import { RandomString } from 'src/common/helpers/utils/string.utils';
import { hashPassword } from 'src/common/helpers/utils/password.utils';
import { SpaceList, SpaceListModel } from 'src/models/space-list.schema';
import {
  MailService,
  SEND_EMAIL_TEMPLATE,
} from 'src/shared/services/mail.service';
import { v4 as uuidV4 } from 'uuid';
import { AppConfigService } from 'src/config/app.config';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CheckEmailDto } from './dto/check-email.dto';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
    @InjectModel(SpaceList.name)
    private readonly spaceListModel: SpaceListModel,
    private readonly i18n: I18nService,
    private readonly mailService: MailService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      const existingUser = await this.userModel.findOne({
        email: signupDto.user.email,
      });
      if (existingUser) {
        throw new BadRequestException({
          message: this.i18n.t('response-messages.field.already_exists', {
            args: {
              field: 'email',
            },
          }),
          field: 'email',
        });
      }

      const userPassword = RandomString(12);
      const hashPass = await hashPassword(userPassword);

      const user = new this.userModel({
        firstName: signupDto.user.firstName,
        lastName: signupDto.user.lastName,
        email: signupDto.user.email,
        intent: signupDto.user.intent,
        spaceType: signupDto.user.spaceType,
        avatar: signupDto.user.avatar,
        genderIdentity: signupDto.user.genderIdentity,
        sexualOrientation: signupDto.user.sexualOrientation,
        password: hashPass,
        isAccountVerified: false,
        isIdVerified: false,
        notificationPreferences: {
          newListing: false,
          newMessage: false,
          favoriteListing: false,
          finishProfile: false,
          finishListing: false,
          chatRequest: false,
        },
        profileStatus: false,
        listingStatus: false,
      });

      // Basic User information
      user.age = signupDto.user?.age;
      user.smokeCigarettes = signupDto.user?.SmokeCigarettes;
      user.smokeMarijuana = signupDto.user?.SmokeMarijuana;
      user.workFromHome = signupDto.user?.workFromHome;
      user.travel = signupDto.user?.travel;
      user.cleanliness = signupDto.user?.cleanliness;
      user.describeMyselfAs = signupDto.user?.describeMyselfAs;
      user.zodiac = signupDto.user?.zodiac;
      user.selfDescription = signupDto.user?.selfDescription;
      user.fluentLanguages = signupDto.user?.fluentLanguages;

      // The room
      user.preferredLocation = signupDto.user?.preferredLocation;
      user.rentalStartDate = signupDto.user?.rentalStartDate;
      user.willingToSignRentalAgreement =
        signupDto.user?.willingToSignRentalAgreement;
      user.wantFurnished = signupDto.user?.wantFurnished;
      user.bedroom = signupDto.user?.bedroom;
      user.bedroomSize = signupDto.user?.bedroomSize;
      user.pets = signupDto.user?.pets;
      user.parkingRequired = signupDto.user?.parkingRequired;

      // Roommate preferences
      user.preferredGenderIdentity = signupDto.user?.preferredGenderIdentity;
      user.preferredSexualOrientation =
        signupDto.user?.preferredSexualOrientation;
      user.preferredAgeRange = signupDto.user?.preferredAgeRange;
      user.preferredSmokingHabits = signupDto.user?.preferredSmokingHabits;

      if ((signupDto.user.intent = USER_INTENT.RENT)) {
        const spaceList = new this.spaceListModel({
          user: user._id,
          spaceType: signupDto.user.spaceType,
          ...signupDto.property,
        });
        await spaceList.save({ session });
      }

      const verificationToken = uuidV4();
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);

      user.verificationCodes = [
        {
          verificationType: USER_VERIFICATION_TYPE.EMAIL_VERIFICATION,
          token: verificationToken,
          expiresAt: tokenExpiry,
        },
      ];

      await user.save({ session });

      // Send verification email
      await this.mailService.sendEmail({
        template: SEND_EMAIL_TEMPLATE.USER_REGISTRATION,
        email: user.email,
        subject: this.i18n.t('response-messages.email.registration.subject'),
        payload: {
          name: user.firstName,
          email: user.email,
          password: userPassword,
          link: `${this.appConfigService.web.base_url}/auth/verify-email?token=${verificationToken}`,
        },
      });

      await session.commitTransaction();
      session.endSession();

      return {
        message: this.i18n.t('response-messages.registration.success'),
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async checkEmail(bodyDto: CheckEmailDto) {
    const existingUser = await this.userModel.findOne({ email: bodyDto.email });
    return {
      message: 'Email check successful',
      isAvailable: !existingUser,
    };
  }

  async verifyEmail(bodyDto: VerifyEmailDto) {
    const user = await this.userModel.findOne({
      'verificationCodes.token': bodyDto.token,
      'verificationCodes.verificationType':
        USER_VERIFICATION_TYPE.EMAIL_VERIFICATION,
    });

    if (!user) {
      throw new BadRequestException({
        message: this.i18n.t('response-messages.field.invalid', {
          args: { field: 'token' },
        }),
      });
    }

    const verificationCode = user.verificationCodes.find(
      (code) =>
        code.token === bodyDto.token &&
        code.verificationType === USER_VERIFICATION_TYPE.EMAIL_VERIFICATION,
    );

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      throw new BadRequestException({
        message: this.i18n.t('response-messages.field.expired', {
          args: { field: 'token' },
        }),
      });
    }

    user.isAccountVerified = true;
    user.verificationCodes = user.verificationCodes.filter(
      (code) => code.token !== bodyDto.token,
    );

    await user.save();

    return {
      message: this.i18n.t('response-messages.registration.email_verified'),
    };
  }
}
