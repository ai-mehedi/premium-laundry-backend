import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceList, SpaceListSchema } from 'src/models/space-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SpaceList.name,
        schema: SpaceListSchema,
      },
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
