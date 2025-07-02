import { Module } from '@nestjs/common';
import { MembershipController } from './membership.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from 'src/models/membership-schema';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
