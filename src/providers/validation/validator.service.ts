import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class ValidatorService {
  private readonly logger = new Logger(ValidatorService.name);

  async ValidateInstanceAndThrowError(obj: any) {
    const res = await validate(obj, { stopAtFirstError: true });

    const err = [];
    res.forEach(item => {
      err.push({ message: item.constraints, field: item.property });
    });

    if (res.length > 0) {
      this.logger.warn(JSON.stringify(obj));
      this.logger.error(err);
      throw new BadRequestException(err);
    }
  }
}
