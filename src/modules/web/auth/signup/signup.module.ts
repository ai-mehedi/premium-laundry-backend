import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { SpaceList, SpaceListSchema } from 'src/models/space-list.schema';
import { MailService } from 'src/shared/services/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: SpaceList.name,
        schema: SpaceListSchema,
      },
    ]),
  ],
  controllers: [SignupController],
  providers: [SignupService, MailService],
})
export class SignupModule {}
