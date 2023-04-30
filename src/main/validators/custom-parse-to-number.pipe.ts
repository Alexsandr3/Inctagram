import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * @description This pipe validates the id and parse it to int
 */
@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const beforeLength = value.length;
    const parsedValue = parseInt(value, 10);
    const afterLength = parsedValue.toString().length;
    if (isNaN(parsedValue) || typeof parsedValue !== 'number' || beforeLength !== afterLength) {
      throw new BadRequestException([{ message: 'id must be a number', field: 'id' }]);
    }
    return parsedValue;
  }
}
