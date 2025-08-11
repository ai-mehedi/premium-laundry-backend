import { PartialType } from '@nestjs/swagger';
import { CreateDeliverypanelDto } from './create-deliverypanel.dto';

export class UpdateDeliverypanelDto extends PartialType(CreateDeliverypanelDto) {}
