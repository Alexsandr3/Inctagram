import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

/**
 * @description This pipe is used to validate id from uri params
 */
@Injectable()
export class ValidateUuidPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new NotFoundException(`Incorrect id,  please enter a valid one`);
    }
    return value;
  }
}
