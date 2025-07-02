import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isMongoId(value)) {
      throw new BadRequestException('Invalid id');
    }
    return value;
  }
}

@Injectable()
export class ValidateMultipleMongoIdsPipe
  implements PipeTransform<string, string[]>
{
  transform(value: string): string[] {
    const ids = value.split(',');
    if (ids.some((id) => !isMongoId(id))) {
      throw new BadRequestException('Invalid id');
    }
    return ids;
  }
}

@Injectable()
export class ValidateOptionalMongoIdPipe
  implements PipeTransform<string, string | undefined>
{
  transform(value: string): string {
    if (value === undefined) {
      return undefined;
    }
    if (!isMongoId(value)) {
      throw new BadRequestException('Invalid id');
    }
    return value;
  }
}
