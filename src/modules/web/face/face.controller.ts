import { Controller, Get, Param, Query } from '@nestjs/common';
import { FaceService } from './face.service';
import { PaginateFaceDto } from './dto/paginate-face.dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';

@ApiTags('Web - Face')
@Controller('web/face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Get()
  getPaginatedFaces(@Query() queryDto: PaginateFaceDto) {
    return this.faceService.getPaginatedFaces(queryDto);
  }

  @Get(':id')
  getFaceById(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.faceService.getFaceById(id);
  }
}
