import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';
import { PaginateFaceDto } from '../face/dto/paginate-face.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guards/user-auth.guard';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserParam } from 'src/common/decorators/user-param.decorator';
import { UserAuth } from 'src/common/types/user-auth.types';

@ApiTags('Web - Space')
@Controller('web/space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get()
  getPaginatedSpaces(@Query() queryDto: PaginateFaceDto) {
    return this.spaceService.getPaginatedSpaces(queryDto);
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getPaginatedSpacesByUser(
    @UserParam() authUser: UserAuth,
    @Query() queryDto: PaginateFaceDto,
  ) {
    return this.spaceService.getPaginatedSpacesByUser(authUser, queryDto);
  }

  @Get(':id')
  getSpaceById(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.spaceService.getSpaceById(id);
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createSpace(
    @UserParam() authUser: UserAuth,
    @Body() createSpaceDto: CreateSpaceDto,
  ) {
    return await this.spaceService.createSpace(authUser, createSpaceDto);
  }
}
